<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)

onMounted(async () => {
  const res = await fetch('/src/assets/mock-products.json')
  const all = await res.json()
  product.value = all.find(p => String(p.id) === String(route.params.id))
})
</script>

<template>
  <div v-if="product" style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <img :src="product.image" :alt="product.title" style="width:100%;border-radius:12px;border:1px solid #e5e7eb" />
    <div>
      <h1>{{ product.title }}</h1>
      <div class="muted">Kategori: {{ product.category }}</div>
      <p class="price">{{ product.price.toLocaleString('tr-TR') }} ₺</p>
      <button class="btn cta">Sepete Ekle</button>
      <p class="muted">Part-1: Bu sayfa mock veriden besleniyor. Part-2'de Firestore'a geçeceğiz.</p>
    </div>
  </div>
  <p v-else class="muted">Yükleniyor…</p>
</template>
