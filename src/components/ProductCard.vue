<!-- src/components/ProductCard.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useFavorites } from '../stores/useFavorites'
import { useToast } from '../stores/useToast'
import { useCart } from '../stores/useCart'

const toast = useToast()
const cart = useCart()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['detail'])

const favorites = useFavorites()
const fallback = 'https://via.placeholder.com/400x300.png?text=No+image'

const showSizes = ref(false)

const title = computed(() => props.item.title || props.item.name || 'Ürün')
const price = computed(() => props.item.price ?? 0)

const baseImage = computed(() => {
  const src = props.item.image
  if (!src || String(src).trim() === '') return fallback
  return String(src).trim()
})


const imageList = computed(() => {
  const first = baseImage.value
  const second = props.item.image2 || first
  return [first, second]
})

const stripX = ref(0)

const onMove = (event) => {
  if (showSizes.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  const clamped = Math.min(Math.max(ratio, 0), 1)

  if (clamped > 0.52) stripX.value = -50
  else if (clamped < 0.48) stripX.value = 0
}

const onLeave = () => {
  stripX.value = 0
}


const onPlusClick = () => {
  const mainCat =
    props.item.mainCategory || props.item.cat || props.item.categoryMain || ''

  const hasSizes = ['women', 'men', 'kids'].includes(mainCat)
  if (!hasSizes) {
    addSingleProductToCart()
    return
  }
  showSizes.value = true
}  

  const selectSize = (size) => {
    const mainCat = 
      props.item.mainCategory ||
      props.item.cat ||
      props.item.categoryMain ||
      ''
  const product = {
    id: props.item,
    title: title.value,
    price: price.value,
    category: props.item.category || '',
    mainCategory: mainCat,
    image: baseImage.value,
    size: size
  }

  cart.addToCart(product)
  toast.showCartAdded()
  showSizes.value = false
}

const addSingleProductToCart = () => {
  const product = {
    id: props.item.id,
    title: title.value,
    price: price.value,
    image: baseImage.value,
  }
  cart.addToCart(product, 1)
  toast.showCartAdded()
}

const isFav = computed(() => favorites.isFav(props.item))
const toggleFav = () => favorites.toggleFavorite(props.item)
</script>

<template>
  <article class="card">
    <div
      class="img-wrap"
      @mousemove="onMove"
      @mouseleave="onLeave"
      @click="$emit('detail', item)"
    >
      <div class="img-strip" :style="{ transform: `translate3d(${stripX}%, 0, 0)` }">
        <img
          v-for="(src, idx) in imageList"
          :key="idx"
          class="img"
          :src="src"
          :alt="title"
        />
      </div>

      <button
        v-if="!showSizes"
        type="button"
        class="icon-plus"
        @click.stop="onPlusClick"
        aria-label="Sepete ekle"
      >
        <svg viewBox="0 0 12 12" class="icon-plus__svg">
          <path
            fill="currentColor"
            d="M5.5 0v5.5H0v1h5.5V12h1V6.5H12v-1H6.5V0z"
          />
        </svg>
      </button>

      <div 
        v-if="showSizes" 
        class="size-overlay" 
        @click.stop
      >
        <div class="size-header">
          <span class="size-label">BEDEN</span>
          <button class="close-btn" @click.stop="showSizes = false">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="size-grid">
          <button 
            v-for="size in (props.item.sizes || props.item.availableSizes || ['XS','S','M','L','XL','XXL'])" 
            :key="size"
            class="size-option"
            @click.stop="selectSize(size)"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <div class="under-image-row">
      <div class="colors-wrapper">
        <span class="color-multi" />
      </div>

      <button
        type="button"
        class="fav-link"
        :class="{ 'fav-link--active': isFav }"
        @click.stop="toggleFav"
        aria-label="Favorilere ekle"
      >
        <svg v-if="isFav" viewBox="0 0 24 24" class="fav-icon">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#111111"
          />
        </svg>
        <svg v-else viewBox="0 0 20 18" class="fav-icon">
          <path
            fill="currentColor"
            d="M5.197 0a5.06 5.06 0 0 0-3.69 1.6c-2.009 2.13-2.007 5.497 0 7.629l8.101 8.606a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l8.109-8.599c2.009-2.13 2.009-5.498 0-7.629a5.06 5.06 0 0 0-7.381 0L10 2.785 8.887 1.6A5.06 5.06 0 0 0 5.197 0m0 .911c1.047 0 2.096.436 2.922 1.311l1.497 1.592a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l1.489-1.585c1.651-1.751 4.185-1.75 5.836 0s1.651 4.635 0 6.385L10 16.798 2.283 8.606a4.74 4.74 0 0 1 0-6.385C3.108 1.347 4.15.911 5.196.911z"
          />
        </svg>
      </button>
    </div>

    <h3 class="title" @click="$emit('detail', item)">{{ title }}</h3>

    <div class="price-row">
      <span v-if="item.oldPrice" class="old-price">{{ item.oldPrice }} TL</span>
      <span :class="['price-main', { 'price-main--discount': item.oldPrice }]">
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

.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 5.3;
  background: #f5f5f5;
  overflow: hidden;
  cursor: pointer;
}

.img-strip {
  display: flex;
  width: 200%;
  height: 100%;
  transform: translate3d(0, 0, 0);
  transition: transform 0.08s ease-out;
}

.img {
  flex: 0 0 50%;
  width: 50%;
  height: 100%;
  object-fit: cover;
}

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
}

.icon-plus__svg {
  width: 13px;
  height: 13px;
  color: #111111;
}

.size-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  padding: 14px 18px 20px;
  z-index: 10;
  cursor: default;
}

.size-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.size-label {
  font-size: 11.5px;
  font-weight: 400;
  color: #111;
  text-transform: uppercase;
  text-align: left;
  margin-left: -15px;
  margin-top: -10px;
}

.close-btn {
  background: none;
  border: none;
  cursor: default;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content:center;
  transform: scale(0.75);
  margin-right: -18px;
  margin-top: -10px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(5, 2fr);
  gap: 8px;
  margin-left: -14px;
}

.size-option {
  height: 35px;
  background: #fff;
  border: 1px solid #111; 
  color: #111;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.under-image-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: 4px;
  position: relative;
  z-index: 2;
  pointer-events: none;
}

.fav-link,
.colors-wrapper {
  pointer-events: auto;
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

.title {
  font-size: 11px;
  font-weight: 400;
  color: #111111;
  margin-top: -45px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

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
  font-size: 12px;
  color: #111111;
  font-weight: 500;
}

.price-main--discount {
  padding: 2px 2px;
  background: #111111;
  color: #ffffff;
}

h1,
h3 {
  text-transform: uppercase;
}
</style>
