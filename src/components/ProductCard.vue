<!-- src/components/ProductCard.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useFavorites } from '../stores/useFavorites'
import { useToast } from '../stores/useToast'

const toast = useToast()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['detail'])

const favorites = useFavorites()

const fallback = 'https://via.placeholder.com/400x300.png?text=No+image'

// ========== البيانات ==========

// العنوان
const title = computed(() => props.item.title || props.item.name || 'Ürün')

// السعر الحالي
const price = computed(() => props.item.price ?? 0)

// الصورة الأساسية
const baseImage = computed(() => {
  const src = props.item.image
  if (!src || String(src).trim() === '') {
    return fallback
  }
  return String(src).trim()
})

// قائمة الصور (لـ hover بين أكثر من صورة عند توفرها)
const imageList = computed(() => {
  const first = baseImage.value
  const second = props.item.image2 || first

  // للتأكد في الكونسول
  console.log('Final images:', first, second)

  return [first, second]
})

// قيمة التحريك أفقياً (%)
const stripX = ref(0)

const onMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  const clamped = Math.min(Math.max(ratio, 0), 1)

  // لو الماوس راح شوي يمين عن النص → على طول الصورة الثانية
  if (clamped > 0.52) {
    stripX.value = -50
  } else if (clamped < 0.48) {
    // لو رجع شوي يسار عن النص → نرجع للصورة الأولى
    stripX.value = 0
  }
}

const onLeave = () => {
  stripX.value = 0 // نرجع للصورة الأولى
}

// 🛒 localStorage cart with quantity (نتركه كما هو الآن)
const addToCart = () => {
  const key = 'cart'
  const current = JSON.parse(localStorage.getItem(key) || '[]')
  const idx = current.findIndex((i) => i.id === props.item.id)

  if (idx !== -1) {
    current[idx].qty = (current[idx].qty || 1) + 1
  } else {
    current.push({
      id: props.item.id,
      title: title.value,
      price: price.value,
      image: baseImage.value,
      qty: 1,
    })
  }

  localStorage.setItem(key, JSON.stringify(current))


    // ⬅ هنا نظهر التوست
  toast.showCartAdded()
}

// ❤️ Favorilerim عبر Pinia useFavorites
const isFav = computed(() => favorites.isFav(props.item))

const toggleFav = () => {
  favorites.toggleFavorite(props.item)
}
</script>

<template>
  <article class="card">
    <!-- صورة المنتج -->
    <div
      class="img-wrap"
      @mousemove="onMove"
      @mouseleave="onLeave"
      @click="$emit('detail', item)"
    >
      <div
        class="img-strip"
        :style="{ transform: `translate3d(${stripX}%, 0, 0)` }"
      >
        <img
          v-for="(src, idx) in imageList"
          :key="idx"
          class="img"
          :src="src"
          :alt="title"
        />
      </div>

      <!-- دائرة + لإضافة المنتج للسلة -->
<button
  type="button"
  class="icon-plus"
  @click.stop="addToCart"
  aria-label="Sepete ekle"
>
  <svg viewBox="0 0 12 12" class="icon-plus__svg">
    <path
      fill="currentColor"
      d="M5.5 0v5.5H0v1h5.5V12h1V6.5H12v-1H6.5V0z"
    />
  </svg>
</button>

    </div>

    <!-- صف تحت الصورة: مربّع الألوان + قلب -->
    <div class="under-image-row">
      <div class="colors-wrapper">
        <span class="color-multi" />
      </div>

      <!-- ❤️ أيقونة القلب (SVG) مرتبطة مع Pinia -->
      <button
        type="button"
        class="fav-link"
        :class="{ 'fav-link--active': isFav }"
        @click.stop="toggleFav"
        aria-label="Favorilere ekle"
      >
        <!-- مفضّل → قلب مليان -->
        <svg
          v-if="isFav"
          viewBox="0 0 24 24"
          class="fav-icon"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#111111"
          />
        </svg>

        <!-- غير مفضّل → قلب مفرغ (SVG مثل DeFacto) -->
        <svg
          v-else
          viewBox="0 0 20 18"
          class="fav-icon"
        >
          <path
            fill="currentColor"
            d="M5.197 0a5.06 5.06 0 0 0-3.69 1.6c-2.009 2.13-2.007 5.497 0 7.629l8.101 8.606a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l8.109-8.599c2.009-2.13 2.009-5.498 0-7.629a5.06 5.06 0 0 0-7.381 0L10 2.785 8.887 1.6A5.06 5.06 0 0 0 5.197 0m0 .911c1.047 0 2.096.436 2.922 1.311l1.497 1.592a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l1.489-1.585c1.651-1.751 4.185-1.75 5.836 0s1.651 4.635 0 6.385L10 16.798 2.283 8.606a4.74 4.74 0 0 1 0-6.385C3.108 1.347 4.15.911 5.196.911z"
          />
        </svg>
      </button>
    </div>

    <!-- العنوان والسعر -->
    <h3 class="title" @click="$emit('detail', item)">
      {{ title }}
    </h3>

    <div class="price-row">
      <span
        v-if="item.oldPrice"
        class="old-price"
      >
        {{ item.oldPrice }} TL
      </span>
      <span
        :class="['price-main', { 'price-main--discount': item.oldPrice }]"
      >
        {{ price }} TL
      </span>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: none;
  border-radius: 0;
  padding: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* الصورة طولية مثل DeFacto */
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 5.3;
  background: #f5f5f5;
  overflow: hidden;
  cursor: pointer;
}

/* شريط الصور (صورتان بجانب بعض) */
.img-strip {
  display: flex;
  width: 200%;
  height: 100%;
  transform: translate3d(0, 0, 0);
  transition: transform 0.08s ease-out;
}

/* كل صورة داخل الشريط */
.img {
  flex: 0 0 50%;
  width: 50%;
  height: 100%;
  object-fit: cover;
}

/* دائرة + */
.icon-plus {
  position: absolute;
  bottom: 15px;
  right: 16px;

  width: 26px;
  height: 26px;
  border-radius: 50%;

  border: none;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(17, 17, 17, 0.06),
    0 4px 10px rgba(0, 0, 0, 0.12);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

/* أيقونة الـ + نفسها */
.icon-plus__svg {
  width: 13px;
  height: 13px;
  color: #111111;
}

/* صف تحت الصورة: القلب فوق + الألوان تحته */
.under-image-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: 4px;
}

.colors-wrapper {
  order: 2;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.color-multi {
  width: 13px;
  height: 13px;
  margin-right: 8px;
  background-image: conic-gradient(
    from 0.62turn,
    #f1ae00,
    #ac14ef 90deg,
    rgba(75, 149, 17, 0.6) 0.51turn,
    #268ceb 270deg,
    #f1ae00
  );
  border: 1px solid #e9e8ea;
  border-radius: 2px;
}

/* القلب */
.fav-link {
  order: 1;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-8px);
}

.fav-icon {
  width: 12px;
  height: 18px;
  color: #22242a;
}

.fav-link--active .fav-icon {
  color: #111111;
}

/* العنوان */
.title {
  font-size: 14px;
  font-weight: 400;
  color: #111111;
  margin-top: -45px;
  cursor: pointer;
}

/* السعر */
.price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: -10px;
}

.old-price {
  font-size: 11px;
  color: #9ca3af;
  text-decoration: line-through;
}

.price-main {
  font-size: 13px;
  color: #111111;
  font-weight: 500;
}

.price-main--discount {
  padding: 2px 8px;
  background: #111111;
  color: #ffffff;
}

.under-image-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: 4px;

  position: relative;
  z-index: 2;
  pointer-events: none; /* ⬅ الجديد: لا تستقبل كليكات */
}

.fav-link,
.colors-wrapper {
  pointer-events: auto; /* ⬅ القلب + الألوان فقط يستقبلوا الكليك */
}

.title {
  position: relative;
  z-index: 1;   /* العنوان تحتهم */
}
</style>
