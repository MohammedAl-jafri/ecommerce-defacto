<!-- src/components/ProductCard.vue -->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['detail'])

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
  return src
})

// قائمة الصور (لـ hover بين أكثر من صورة عند توفرها)
const imageList = computed(() => {
  const list = []

  // لو عندك مصفوفة images في الـ Firestore
  if (Array.isArray(props.item.images) && props.item.images.length) {
    props.item.images.forEach((img) => {
      if (img && String(img).trim() !== '') {
        list.push(String(img).trim())
      }
    })
  }

  // خصائص إضافية اختيارية
  ;['image2', 'image3'].forEach((key) => {
    if (props.item[key]) {
      list.push(String(props.item[key]).trim())
    }
  })

  // لو ما فيه ولا شيء → نستخدم الصورة الأساسية
  if (!list.length) {
    list.push(baseImage.value)
  }

  // حتى لو صورة واحدة فقط نكررها (لمنطقيّة الكود)
  if (list.length === 1) {
    list.push(list[0])
  }

  // نكتفي بأول صورتين
  return list.slice(0, 2)
})

const hovered = ref(false)
const onEnter = () => {
  hovered.value = true
}
const onLeave = () => {
  hovered.value = false
}

// 🛒 localStorage cart with quantity
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
  console.log('added to cart:', title.value)
}

// ❤️ Favorilerim (localStorage بسيط)
const isFav = ref(false)

const toggleFav = () => {
  isFav.value = !isFav.value

  const key = 'favorites'
  const current = JSON.parse(localStorage.getItem(key) || '[]')

  const idx = current.findIndex((i) => i.id === props.item.id)

  if (isFav.value) {
    if (idx === -1) {
      current.push({
        id: props.item.id,
        title: title.value,
        price: price.value,
        image: baseImage.value,
      })
    }
  } else if (idx !== -1) {
    current.splice(idx, 1)
  }

  localStorage.setItem(key, JSON.stringify(current))
}
</script>

<template>
  <article class="card">
    <!-- صورة المنتج (مع تأثير عند hover) -->
    <div
      class="img-wrap"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @click="$emit('detail', item)"
    >
      <!-- الصورة الأولى -->
      <img
        class="img img--base"
        :src="imageList[0]"
        :alt="title"
      />
      <!-- الصورة الثانية تظهر عند hover لو كانت مختلفة -->
      <img
        class="img img--hover"
        :src="imageList[1]"
        :alt="title"
        :class="{ 'img--visible': hovered }"
      />

      <!-- دائرة + لإضافة المنتج للسلة -->
      <button
        type="button"
        class="icon-plus"
        @click.stop="addToCart"
      >
        +
      </button>
    </div>

    <!-- صف تحت الصورة: مربّع الألوان + قلب -->
    <div class="under-image-row">
      <div class="colors-wrapper">
        <span class="color-multi" />
      </div>

      <button
        type="button"
        class="fav-link"
        :class="{ 'fav-link--active': isFav }"
        @click.stop="toggleFav"
      >
        <span v-if="isFav">♥</span>
        <span v-else>♡</span>
      </button>
    </div>

    <!-- العنوان مباشرة تحت الصورة -->
    <h3 class="title" @click="$emit('detail', item)">
      {{ title }}
    </h3>

    <!-- السعر مباشرة تحت العنوان -->
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

/* الصورة أكبر مثل DeFacto (طولية) */
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 5.3;
  background: #f5f5f5;
  overflow: hidden;
  cursor: pointer;
}

/* طبقتان من الصور للتبديل + تأثير الحركة */
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  transition: opacity 0.35s ease, transform 0.4s ease;
}

.img--base {
  opacity: 1;
}

.img--hover {
  opacity: 0;
}

.img--hover.img--visible {
  opacity: 1;
}

/* تأثير زوم/حركة خفيفة عند مرور الماوس (حتى مع صورة واحدة) */
.img-wrap:hover .img {
  transform: scale(1.04) translateY(-6px);
}

/* دائرة + */
.icon-plus {
  position: absolute;
  bottom: 12px;
  right: 13px;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 29px;
  font-weight: 300;
  cursor: pointer;
}

/* صف تحت الصورة: القلب فوق + الألوان تحته */
.under-image-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: 4px;
}

/* الحاوية التي بداخلها مربع الألوان */
.colors-wrapper {
  order: 2; /* الألوان تحت */
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

/* القلب */
.fav-link {
  order: 1; /* القلب فوق */
}

/* مربع اللون المتعدّد مثل DeFacto */
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

/* القلب خارج الصورة في أقصى اليمين */
.fav-link {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: 25px;
  line-height: 1;
  color: #22242a;
}

.fav-link--active {
  color: #111111;
}

/* العنوان قريب من الصورة */
.title {
  font-size: 14px;
  font-weight: 400;
  color: #111111;
  margin-top: -45px;
  cursor: pointer;
}

/* السعر تحت العنوان مباشرة */
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

/* السعر العادي + شكل الخصم عند وجود oldPrice */
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
</style>
