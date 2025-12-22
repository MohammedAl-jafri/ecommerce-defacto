<!-- src/components/ProductCard.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useFavorites } from '../stores/useFavorites'
import { useToast } from '../stores/useToast'
import { useCart } from '../stores/useCart'
import ProductTitle from './atoms/ProductTitle.vue'
import PriceText from './atoms/PriceText.vue'
import FavoriteToggle from './molecules/FavoriteToggle.vue'
import ColorMultiSwatch from './atoms/ColorMultiSwatch.vue'
import SizeOverlay from './molecules/SizeOverlay.vue'
import ProductImageHover from './molecules/ProductImageHover.vue'

const toast = useToast()
const cart = useCart()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const sizes = computed(() => props.item.sizes || props.item.availableSizes || ['XS','S','M','L','XL','XXL'])

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
    id: props.item.id,
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
<div class="img-area" @click="$emit('detail', item)">
  <ProductImageHover
    :images="imageList"
    :alt="title"
    :disabled="showSizes"
  />

  <button
    v-if="!showSizes"
    type="button"
    class="icon-plus"
    @click.stop="onPlusClick"
    aria-label="Sepete ekle"
  >
    <svg viewBox="0 0 12 12" class="icon-plus__svg">
      <path fill="currentColor" d="M5.5 0v5.5H0v1h5.5V12h1V6.5H12v-1H6.5V0z" />
    </svg>
  </button>

  <SizeOverlay
    :open="showSizes"
    :sizes="sizes"
    @close="showSizes = false"
    @select="selectSize"
  />
</div>


    <div class="under-image-row">
      <div class="colors-wrapper">
  <ColorMultiSwatch />
</div>

<FavoriteToggle :active="isFav" @toggle="toggleFav" />

    </div>

  <ProductTitle :title="title" @click="$emit('detail', item)" />

<PriceText :price="price" :oldPrice="item.oldPrice" />

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

.img-area {
  position: relative;
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

.under-image-row :deep(button),
.under-image-row :deep(.fav-link),
.colors-wrapper {
  pointer-events: auto;
}


.colors-wrapper {
  order: 2;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

h1,
h3 {
  text-transform: uppercase;
}
</style>
