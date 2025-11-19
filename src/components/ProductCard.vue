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

// 🛒 localStorage cart with quantity
const addToCart = () => {
  const key = 'cart'
  const current = JSON.parse(localStorage.getItem(key) || '[]')

  const idx = current.findIndex((i) => i.id === props.item.id)

  if (idx !== -1) {
    // product already in cart → sadece adet artır
    current[idx].qty = (current[idx].qty || 1) + 1
  } else {
    // yeni ürün
    current.push({
      id: props.item.id,
      title: title.value,
      price: price.value,
      category: category.value,
      image: image.value,
      qty: 1,
    })
  }

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
      <button class="btn-outline" @click="$emit('detail', item)">Detay</button>
      <button class="btn-solid" @click="addToCart">Sepete Ekle</button>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 10px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.04);
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
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.cat {
  font-size: 13px;
  color: #6b7280;
  text-transform: lowercase;
}

.price {
  font-weight: 600;
  color: #111827;
  font-size: 15px;
}

.actions {
  display: flex;
  gap: 10px;
}

/* DeFacto style buttons */
.btn-outline,
.btn-solid {
  flex: 1;
  padding: 8px 0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #111827;
}

/* white background, black text */
.btn-outline {
  color: #111827;
  background: #ffffff;
}

/* black background, white text */
.btn-solid {
  color: #ffffff;
  background: #111827;
}
</style>
