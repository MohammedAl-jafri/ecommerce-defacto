<!-- src/pages/ProductDetail.vue -->
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../stores/useCart'
import { useFavorites } from '../stores/useFavorites'
import { useToast } from '../stores/useToast'

const cart = useCart()
const favorites = useFavorites()
const toast = useToast()

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
})

const route = useRoute()
const product = ref(props.product)
const loading = ref(true)
const notFound = ref(false)

const isShareOpen = ref(false)

const buildProduct = (snap) => {
  const data = snap.data()
  return {
    id: snap.id,
    title: data.title || data.name || 'Ürün',
    price: data.price || 0,
    category: data.category || '',
    image:
      (data.image || '')
        .toString()
        .trim()
        .replace(/^image:\s*/i, '') ||
      'https://via.placeholder.com/600x600?text=Product+Image',
    description: data.description || '',
    ...data,
  }
}

const loadProduct = async (idParam) => {
  loading.value = true
  notFound.value = false

  try {
    const asNumber = Number(idParam)
    const isNumeric =
      !Number.isNaN(asNumber) && String(asNumber) === String(idParam)

    if (isNumeric) {
      const qRef = query(
        collection(db, 'products'),
        where('productId', '==', asNumber),
        limit(1),
      )
      const qSnap = await getDocs(qRef)

      if (qSnap.empty) {
        product.value = null
        notFound.value = true
      } else {
        const docSnap = qSnap.docs[0]
        product.value = buildProduct(docSnap)
      }
    } else {
      const refDoc = doc(db, 'products', idParam)
      const snap = await getDoc(refDoc)

      if (snap.exists()) {
        product.value = buildProduct(snap)
      } else {
        product.value = null
        notFound.value = true
      }
    }
  } catch (err) {
    console.error('Ürün alınamadı:', err)
    product.value = null
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const sizeOpen = ref(false)
const selectedSize = ref('')

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL','XXL']

const isNeedsSize = computed(() => {
  if (!product.value) return false
  const mainCategory =
    product.value.mainCategory || product.value.cat || product.value.categoryMain || ''
  return cart.isSizedCategory(mainCategory)
})

const sizeOptions = computed(() => {
  const p = product.value
  if (!p) return defaultSizes
  const s = p.sizes || p.availableSizes
  return Array.isArray(s) && s.length ? s : defaultSizes
})

const toggleSizeDropdown = () => {
  sizeOpen.value = !sizeOpen.value
}

const closeSizeDropdown = () => {
  sizeOpen.value = false
}

const chooseSize = (s) => {
  selectedSize.value = String(s || '').trim()
  closeSizeDropdown()
  addToCart()
}



const addToCart = () => {
  if (!product.value) return

  if (isNeedsSize.value && !selectedSize.value) {
    selectedSize.value = ''
    sizeOpen.value = true
    return
  }

  const payload = {
    ...product.value,
    size: isNeedsSize.value ? selectedSize.value : (product.value.size || null),
  }

  cart.addToCart(payload)
  toast.showCartAdded()
  selectedSize.value = ''   
}

const isFav = computed(() =>
  product.value ? favorites.isFav(product.value) : false,
)

const toggleFavorite = () => {
  if (!product.value) return
  favorites.toggleFavorite(product.value)
}

onMounted(() => {
  if (product.value) {
    loading.value = false
    return
  }

  const id = route.params.id
  if (id) {
    loadProduct(id)
  } else {
    loading.value = false
    notFound.value = true
  }
})

watch(
  () => route.params.id,
  (newId) => {
    if (!props.product && newId) {
      loadProduct(newId)
    }
  },
)

const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutside__ = (e) => {
      if (!(el === e.target || el.contains(e.target))) binding.value(e)
    }
    document.addEventListener('click', el.__clickOutside__)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutside__)
  },
}

</script>

<template>
  <section class="page">
    <p v-if="loading" class="muted loading">Yükleniyor…</p>

    <div v-else-if="notFound" class="notfound">
      <h2>Ürün bulunamadı</h2>
      <p>Bu ürün veritabanında yok veya silinmiş olabilir.</p>
    </div>

    <div v-else class="detail-layout">
      <!-- يسار: الصورة الكبيرة -->
<div class="detail-media">
  <div class="image-wrapper">
    <img
      class="detail-main-image"
      :src="product.image"
      :alt="product.title"
    />
  </div>
</div>

      <!-- يمين: المعلومات -->
      <div class="detail-info">
        <h1 class="detail-title">
          {{ product.title }}
        </h1>

        <!-- السعر + القلب + زر المشاركة -->
        <div class="detail-price-row">
          <div class="detail-price">
            {{ product.price.toLocaleString('tr-TR') }} TL
          </div>

          <div class="detail-icons">
            <!-- ❤️ قلب بدون دائرة -->
<button
  type="button"
  class="icon-trigger icon-trigger--heart"
  :class="{ 'icon-trigger--active': isFav }"
  aria-label="Favorilere ekle"
  @click="toggleFavorite"
>
  <svg v-if="isFav" viewBox="0 0 24 24" class="icon-svg" style="fill: #111111;">
     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>

  <svg v-else viewBox="0 0 20 18" class="icon-svg">
    <path
      fill="currentColor"
      d="M5.197 0a5.06 5.06 0 0 0-3.69 1.6c-2.009 2.13-2.007 5.497 0 7.629l8.101 8.606a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l8.109-8.599c2.009-2.13 2.009-5.498 0-7.629a5.06 5.06 0 0 0-7.381 0L10 2.785 8.887 1.6A5.06 5.06 0 0 0 5.197 0m0 .911c1.047 0 2.096.436 2.922 1.311l1.497 1.592a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l1.489-1.585c1.651-1.751 4.185-1.75 5.836 0s1.651 4.635 0 6.385L10 16.798 2.283 8.606a4.74 4.74 0 0 1 0-6.385C3.108 1.347 4.15.911 5.196.911z"
    />
  </svg>
</button>

            <!-- زر المشاركة + القائمة العمودية -->
            <div
              class="share-wrapper"
              @mouseenter="isShareOpen = true"
              @mouseleave="isShareOpen = false"
            >
              <button
                type="button"
                class="icon-trigger icon-trigger--share"
                aria-label="Paylaş"
              >
                <svg viewBox="0 0 20 20" class="icon-svg">
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M20 3.333a3.333 3.333 0 0 1-6.298 1.524L6.585 9.263a3.3 3.3 0 0 1 0 1.474l7.116 4.405a3.334 3.334 0 1 1-.368 1.525 3.4 3.4 0 0 1 .045-.548l-7.166-4.436a3.33 3.33 0 0 1-2.879 1.652 3.335 3.335 0 0 1 0-6.668 3.33 3.33 0 0 1 2.878 1.651l7.166-4.436A3.334 3.334 0 1 1 20 3.333m-3.333 2.222a2.222 2.222 0 1 0 0-4.444 2.222 2.222 0 0 0 0 4.444m0 13.333a2.222 2.222 0 1 0 0-4.444 2.222 2.222 0 0 0 0 4.444M5.556 10.001a2.222 2.222 0 1 1-4.444 0 2.222 2.222 0 0 1 4.444 0"
                  />
                </svg>
              </button>

              <!-- القائمة العمودية -->
              <div
                class="share-menu"
                :class="{ 'share-menu--open': isShareOpen }"
              >
                <!-- 1) زر مشاركة فقط داخل القائمة -->
                <button
                  type="button"
                  class="share-item share-item--share"
                  aria-label="Paylaş"
                >
                  <svg viewBox="0 0 20 20" class="share-icon-svg">
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M20 3.333a3.333 3.333 0 0 1-6.298 1.524L6.585 9.263a3.3 3.3 0 0 1 0 1.474l7.116 4.405a3.334 3.334 0 1 1-.368 1.525 3.4 3.4 0 0 1 .045-.548l-7.166-4.436a3.33 3.33 0 0 1-2.879 1.652 3.335 3.335 0 0 1 0-6.668 3.33 3.33 0 0 1 2.878 1.651l7.166-4.436A3.334 3.334 0 1 1 20 3.333m-3.333 2.222a2.222 2.222 0 1 0 0-4.444 2.222 2.222 0 0 0 0 4.444m0 13.333a2.222 2.222 0 1 0 0-4.444 2.222 2.222 0 0 0 0 4.444M5.556 10.001a2.222 2.222 0 1 1-4.444 0 2.222 2.222 0 0 1 4.444 0"
                    />
                  </svg>
                </button>

                <!-- 2) Facebook -->
                <button
                  type="button"
                  class="share-item share-item--fb"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 12.612 24" class="share-icon-svg">
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="m12.612 3.984-2.284.001c-1.793 0-2.141.841-2.141 2.077v2.724h4.275l-.557 4.267H8.187V24H3.729V13.053H0V8.786h3.729V5.64C3.729 1.988 5.985 0 9.281 0c1.58 0 2.936.116 3.331.168z"
                    />
                  </svg>
                </button>

                <!-- 3) X -->
                <button
                  type="button"
                  class="share-item share-item--x"
                  aria-label="X"
                >
                  <svg viewBox="0 0 23.484 24" class="share-icon-svg">
                    <path
                      fill="currentColor"
                      d="M13.976 10.162 22.719 0h-2.072l-7.591 8.824L6.993 0H0l9.168 13.343L0 24h2.072l8.016-9.318L16.491 24h6.993zm-2.838 3.298-.929-1.329L2.818 1.56H6l5.965 8.532.929 1.329 7.754 11.091h-3.182l-6.327-9.05z"
                    />
                  </svg>
                </button>

                <!-- 4) WhatsApp -->
                <button
                  type="button"
                  class="share-item share-item--wa"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 26 26" class="share-icon-svg">
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M11.007.17a12.9 12.9 0 0 0-8.433 5.481C.037 9.413-.259 14.303 1.803 18.387l.447.885-1.145 3.343C.475 24.453-.021 25.976.002 26s1.62-.459 3.549-1.072l3.506-1.114.676.329c.829.404 1.878.758 2.946.993.69.152 1.063.178 2.571.18 1.651.002 1.826-.012 2.742-.226 2.559-.598 4.439-1.634 6.285-3.462s2.891-3.692 3.494-6.228c.215-.905.23-1.084.23-2.717-.001-1.498-.026-1.861-.18-2.541C24.772 5.49 21.523 1.944 17.02.534c-1.727-.541-4.157-.688-6.013-.364m.479 2.14c-1.563.296-2.939.846-4.191 1.676-.833.552-2.264 1.97-2.821 2.795a11.6 11.6 0 0 0-1.498 3.276c-.245.916-.257 1.029-.262 2.584-.005 1.53.009 1.678.226 2.505a11 11 0 0 0 1.267 3.003l.453.745-.638 1.855c-.351 1.02-.618 1.874-.594 1.899s.922-.237 1.994-.58l1.949-.624.294.174c2.773 1.636 5.946 1.995 8.945 1.012a10.4 10.4 0 0 0 4.333-2.749 10.25 10.25 0 0 0 2.889-7.198c0-2.853-1.063-5.386-3.106-7.405-1.491-1.473-2.941-2.292-4.973-2.808-.69-.175-1.048-.213-2.256-.238-.974-.02-1.62.005-2.01.079zM8.44 6.587c-.317.159-.801.657-1.116 1.149-.451.706-.601 1.981-.347 2.958.496 1.914 2.862 5.022 4.905 6.446.958.667 3.131 1.618 4.208 1.842 1.482.307 3.306-.602 3.675-1.833.176-.586.169-1.154-.014-1.315-.296-.259-2.671-1.463-2.963-1.501-.284-.038-.326-.014-.627.354-.546.668-1.124 1.248-1.242 1.248-.198 0-1.528-.701-2.042-1.077-.945-.69-1.716-1.542-2.368-2.617-.161-.266-.293-.553-.293-.638s.198-.38.44-.655c.426-.484.708-.926.708-1.11 0-.238-1.1-2.989-1.257-3.142-.279-.274-1.214-.335-1.666-.109z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- اللون المختار -->
        <div class="detail-color-block">
          <div class="detail-color-label">
            SEÇİLEN RENK:
            <span class="detail-color-name">
              {{ (product.selectedColor || 'SİYAH').toUpperCase() }}
            </span>
          </div>

          <div class="detail-color-row">
            <button type="button" class="color-dot color-dot--black"></button>
            <button type="button" class="color-dot color-dot--green"></button>
            <button type="button" class="color-dot color-dot--gray"></button>
            <button type="button" class="color-dot color-dot--blue"></button>
          </div>
        </div>

<div class="addbox" v-click-outside="closeSizeDropdown">
  <button 
    v-show="!sizeOpen" 
    class="detail-add-btn" 
    @click.stop="addToCart"
  >
    SEPETE EKLE
  </button>

  <transition name="size-drop">
    <div v-show="sizeOpen" class="size-dropdown">
      <button
        v-for="s in sizeOptions"
        :key="s"
        type="button"
        class="size-row"
        @click.stop="chooseSize(s)"
      >
        {{ s }}
      </button>
    </div>
  </transition>
</div>


        <!-- الوصف -->
        <div class="detail-description" v-if="product.description">
          {{ product.description }}
        </div>

        <!-- البلوكات السفلية (شكل فقط) -->
        <div class="detail-info-sections">
          <div class="info-section-row">
            <span class="info-section-title">BEDENİNİ BUL</span>
          </div>
          <div class="info-section-row">
            <span class="info-section-title">MAĞAZADA ARA</span>
          </div>
          <div class="info-section-row">
            <span class="info-section-title">ÜRÜN BİLGİLERİ</span>
          </div>
          <div class="info-section-row">
            <span class="info-section-title">ÜRÜN DEĞERLENDİRMELERİ</span>
          </div>
          <div class="info-section-row">
            <span class="info-section-title">ÖDEME BİLGİLERİ</span>
          </div>
          <div class="info-section-row">
            <span class="info-section-title">TESLİMAT / İADE VE DEĞİŞİM</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  background: #ffffff;
  padding: 40px 32px 60px;
  min-height: 70vh;
}

.detail-layout {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  column-gap: 56px;
  align-items: flex-start;
}

/* الصورة */
.detail-media {
  width: 100%;
}

.detail-main-image {
  width: 100%;
  display: block;
  object-fit: cover;
  background: #f5f5f5;
}

/* المعلومات */
.detail-info {
  padding-top: 150px;
}

.detail-title {
  font-size: 18px;
  line-height: 1.4;
  font-weight: 400;
  color: #111111;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}

.detail-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.detail-price {
  font-size: 18px;
  font-weight: 700;
  color: #111111;
}

.detail-icons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -120px;      /* لو حسيتهم نازلين شوي، خفّضها أو احذفها */
}

/* زرّ القلب + المشاركة (بدون دائرة) */
.icon-trigger {
  border: none;
  background: none;
  padding: 0;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-svg {
  width: 20px;
  height: 20px;
  color: #22242a;
}

.icon-trigger--heart.icon-trigger--active .icon-svg {
  color: #111111; /* يغمق لما تكون مفضلة */
}

/* غلاف زر المشاركة + القائمة */
.share-wrapper {
  position: relative;
}

/* زر المشاركة داخل القائمة (بدون دائرة، نفس الحجم، مع هوفر أسود) */
.share-menu .share-item:first-child {
  border: none;
  background: transparent;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22242a;              /* لون افتراضي مثل باقي الأيقونات */
}

/* حجم أيقونة المشاركة داخل القائمة */
.share-menu .share-item:first-child .share-icon-svg {
  width: 22px;
  height: 22px;
}

.share-menu {
  position: absolute;
  top: 25px;
  right: 0;
  padding: 8px 10px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  z-index: 20;

  cursor: pointer;           /* ⬅⬅ هذا السطر الجديد */
}


/* عند المرور → تصبح سوداء مثل الباقي */
.share-menu .share-item:first-child:hover {
  color: #111111;
}




/* القائمة العمودية المخفية افتراضياً */
.share-menu {
  position: absolute;
  top: 25px;
  right: 0;
  padding: 8px 10px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  z-index: 20;
}

/* لما isShareOpen = true */
.share-menu--open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* زرّ أيقونة السوشال (دائرة ملونة) */
.share-item {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid currentColor;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.share-icon-svg {
  width: 16px;
  height: 16px;
}

/* الألوان الأصلية لكل عنصر */
.share-item--fb {
  color: #1877f2;
}

.share-item--x {
  color: #000000;
}

.share-item--wa {
  color: #25d366;
}

/* عند المرور → الكل أسود */
.share-item:hover {
  color: #111111;
  border-color: #111111;
}

/* اللون المختار */
.detail-color-block {
  margin-bottom: 18px;
}

.detail-color-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555555;
  margin-bottom: 6px;
}

.detail-color-name {
  font-weight: 700;
  color: #111111;
}

.detail-color-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 22px;
  height: 22px;
  border-radius: 2px;
  border: 1px solid #d4d4d4;
  cursor: pointer;
  padding: 0;
}

.color-dot--black {
  background: #111111;
}
.color-dot--green {
  background: #5aa65a;
}
.color-dot--gray {
  background: #444444;
}
.color-dot--blue {
  background: #3456c0;
}

/* زر السلة */
.detail-add-btn {
  margin-top: 12px;
  margin-bottom: 22px;
  width: 100%;
  border: none;
  height: 46px;
  background: #111111;
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

/* الوصف */
.detail-description {
  font-size: 13px;
  line-height: 1.7;
  color: #444444;
  margin-bottom: 26px;
}

/* البلوكات السفلية */
.detail-info-sections {
  border-top: none !important;
}

.info-section-row {
  padding: 12px 0;
  border-bottom: none !important;
}


.info-section-title {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #22242a;
}

/* نفس حجم صورة DeFacto الأصلية */
.image-wrapper {
  width: 100%;
  aspect-ratio: 400 / 600; /* نفس أبعاد ديفاكتو تقريباً */
  background: #f5f5f5;
  overflow: hidden;
}

.detail-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== أسطر المعلومات السفلية ===== */

/* إزالة الخطوط لو كانت موجودة */
.info-section-row {
  padding: 14px 0;
  border-bottom: none;
}

/* شكل النص مثل الموقع (غامق قليلاً) */
.info-section-title {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  color: #22242a;
  cursor: pointer;          /* 👈 اليد على النص فقط */
}

.title {
  text-transform: uppercase;
}



/* حالات عامة */
.muted {
  color: #6b7280;
}
.loading {
  text-align: center;
}
.notfound {
  text-align: center;
  padding: 40px;
}

.addbox {
  position: relative;
  width: 100%;
}

.size-dropdown {
  width: 100%;
  border: 1px solid #d4d4d4;
  background: #fff;
  margin-top: 0px;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
}

.size-row {
  width: 100%;
  text-align: left;
  padding: 14px 22px;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 17px;
  color: #111;
}

.size-row:last-child {
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .size-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 32px;
  }

  .detail-price-row {
    justify-content: flex-start;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .page {
    padding: 24px 16px 40px;
  }
}
</style>
