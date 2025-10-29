<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const picks = ref([])

onMounted(async () => {
  const res = await fetch('/src/assets/mock-products.json')
  const all = await res.json()
  picks.value = all.slice(0, 8)
})
</script>

<template>
  <section style="display:grid;gap:18px">
    <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:18px">
      <h2>Öne Çıkanlar</h2>
      <p class="muted">Basit bir e-ticaret şablonu. Arama, grid, detay ve sepet sayfaları hazır.</p>
    </div>
    <div class="grid">
      <ProductCard v-for="p in picks" :key="p.id" :item="p" />
    </div>
  </section>
</template>
