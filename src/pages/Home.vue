<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ProductCard from '../components/ProductCard.vue'

const featured = ref([])
const loading = ref(true)
const router = useRouter()

const goToDetail = (product) => {
  router.push(`/product/${product.id}`)
}

onMounted(async () => {
  try {
    const snap = await getDocs(collection(db, 'products'))
    const arr = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))
    // show first 3
    featured.value = arr.slice(0, 3)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="home-block">
    <h2>Öne Çıkanlar</h2>
    <p>Basit bir e-ticaret şablonu. Arama, grid, detay ve sepet sayfaları hazır.</p>

    <div v-if="!loading" class="grid">
      <ProductCard
        v-for="p in featured"
        :key="p.id"
        :item="p"
        @detail="goToDetail"
      />
    </div>

    <p v-else>Ürünler yükleniyor…</p>
  </section>
</template>

<style scoped>
.home-block {
  background: #f8fafc00;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
  margin-top: 12px;
}
</style>
