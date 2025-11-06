<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// fallback image (used if Firestore has empty or bad URL)
const fallback =
  'https://via.placeholder.com/400x300.png?text=No+image'

// normalize fields
const title = computed(() => props.item.title || props.item.name || 'Ürün')
const category = computed(() => props.item.category || '')
const price = computed(() => props.item.price ?? 0)
const image = computed(() => props.item.image || fallback)
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
      <button class="btn-secondary">Detay</button>
      <button class="btn-primary">Sepete Ekle</button>
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
