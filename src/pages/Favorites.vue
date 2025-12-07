<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const favorites = ref([])

onMounted(() => {
  const key = 'favorites'
  const current = JSON.parse(localStorage.getItem(key) || '[]')
  favorites.value = current
})

const goToDetail = (product) => {
  const pid = product.productId || product.id
  if (!pid) return
  router.push(`/product/${pid}`)
}
</script>

<template>
  <section class="products-page">
    <header class="products-header">
      <h1 class="products-title">FAVORİLERİM</h1>
    </header>

    <p v-if="!favorites.length" class="empty-text">
      Henüz favori ürün eklemediniz.
    </p>

    <div v-else class="grid">
      <ProductCard
        v-for="p in favorites"
        :key="p.id"
        :item="p"
        @detail="goToDetail"
      />
    </div>
  </section>
</template>

<style scoped>
.products-page {
  padding: 32px 0 64px;
  background: #ffffff;
}

.products-header {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}

.products-title {
  font-size: 14px;
  letter-spacing: 0.18em;
  font-weight: 400;
  color: #111111;
  text-transform: uppercase;
}

.grid {
  max-width: 1320px;
  margin: 24px auto 0;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 40px;
}

.empty-text {
  max-width: 1320px;
  margin: 40px auto 0;
  padding: 0 24px;
  color: #6b7280;
  font-size: 14px;
}
</style>
