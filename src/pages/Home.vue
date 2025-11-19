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
    featured.value = arr.slice(0, 3)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="home">
    <div class="hero-text">
      <h1>Öne Çıkan Ürünler</h1>
      <p>En sevilen ürünleri keşfet ve hemen alışverişe başla.</p>
    </div>

    <div v-if="!loading" class="grid">
      <ProductCard
        v-for="p in featured"
        :key="p.id"
        :item="p"
        @detail="goToDetail"
      />
    </div>

    <p v-else class="loading-text">Ürünler yükleniyor…</p>
  </section>
</template>

<style scoped>
/* Main container spacing like DeFacto */
.home {
  padding: 40px 0 60px;
  background: #fafafa;
}

/* Title + subtitle */
.hero-text {
  text-align: center;
  margin-bottom: 30px;
}

.hero-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.hero-text p {
  font-size: 15px;
  color: #6b7280;
  margin-top: 6px;
}

/* Product grid like DeFacto */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 22px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
}

/* Loading text */
.loading-text {
  text-align: center;
  color: #6b7280;
  margin-top: 20px;
}
</style>
