<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// we still emit detail so parent pages can open /product/:id
const emit = defineEmits(['detail'])

const fallback = 'https://via.placeholder.com/400x300.png?text=No+image'

// normalize fields
const title = computed(() => props.item.title || props.item.name || 'Ürün')
const category = computed(() => props.item.category || '')
const price = computed(() => props.item.price ?? 0)

// fix: some Firestore docs have empty string for image → use fallback
const image = computed(() => {
  const src = props.item.image
  if (!src || String(src).trim() === '') {
    return fallback
  }
  return src
})

// simple localStorage cart
const addToCart = () => {
  const key = 'cart'
  const current = JSON.parse(localStorage.getItem(key) || '[]')
  current.push({
    id: props.item.id,
    title: title.value,
    price: price.value,
    category: category.value,
    image: image.value,
  })
  localStorage.setItem(key, JSON.stringify(current))
  console.log('added to cart:', title.value)
}
</script>

<template>
  <article class="card">
    <div class="img-wrap">
      <img :src="image" :alt="title" />
    </div>

    <h3 class="title">{{ title }}</h3>
    <p class="cat">{{ category }}</p>
    <p class="price">{{ price }} ₺</p>

    <div class="actions">
      <button class="btn-secondary" @click="$emit('detail', item)">Detay</button>
      <button class="btn-primary" @click="addToCart">Sepete Ekle</button>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px 12px 14px;
  display: grid;
  gap: 8px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
}

.img-wrap {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  font-size: 14px;
  font-weight: 600;
}

.cat {
  font-size: 12px;
  color: #6b7280;
  text-transform: lowercase;
}

.price {
  font-weight: 700;
  color: #f97316;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 6px 0;
  font-size: 12px;
  cursor: pointer;
}

.btn-secondary {
  background: #e5e7eb;
}

.btn-primary {
  background: #f97316;
  color: white;
}
</style>
