<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const router = useRouter()

// all products from Firestore
const all = ref([])

// query params
const q = ref(route.query.q || '')
const cat = ref(route.query.cat || '')
const sort = ref(route.query.sort || '')

// navigate to detail
const goToDetail = (product) => {
  router.push(`/product/${product.id}`)
}

// sync URL with filters
const applyQueryToUrl = () => {
  router.replace({
    name: 'products',
    query: {
      q: q.value || undefined,
      cat: cat.value || undefined,
      sort: sort.value || undefined
    }
  })
}

watch([q, cat, sort], applyQueryToUrl)

watch(
  () => route.query,
  (nv) => {
    q.value = nv.q || ''
    cat.value = nv.cat || ''
    sort.value = nv.sort || ''
  }
)

// 🔥 get products from Firestore
onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'products'))
  // normalize fields so ProductCard and filters work
  all.value = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      // if Firestore has "name", make a "title" too
      title: data.title || data.name || 'Ürün',
      price: data.price || 0,
      category: data.category || '',
      // ✅ clean image (trim + remove "image:" prefix if it exists)
      image: (data.image || '')
        .toString()
        .trim()
        .replace(/^image:\s*/i, ''),
      ...data
    }
  })
})

const filtered = computed(() => {
  let items = all.value

  // filter by category
  if (cat.value) {
    items = items.filter(i => i.category === cat.value)
  }

  // search by title
  if (q.value) {
    items = items.filter(i =>
      (i.title || '').toLowerCase().includes(q.value.toLowerCase())
    )
  }

  // sort
  if (sort.value === 'price-asc') {
    items = [...items].sort((a, b) => a.price - b.price)
  }
  if (sort.value === 'price-desc') {
    items = [...items].sort((a, b) => b.price - a.price)
  }

  return items
})
</script>

<template>
  <section class="products-page">
    <header class="products-header">
      <h1>Ürünler</h1>
      <p>Tüm ürünleri listele, filtrele ve fiyatlara göre sırala.</p>
    </header>

    <!-- Filters row -->
    <div class="filters">
      <input
        v-model="q"
        placeholder="Ürün ara…"
        class="filter-input"
      />

      <select v-model="cat" class="filter-select">
        <option value="">Kategori: Hepsi</option>
        <option value="tshirt">Tişört</option>
        <option value="jeans">Jean</option>
        <option value="shoes">Ayakkabı</option>
        <option value="clothing">Clothing</option>
      </select>

      <select v-model="sort" class="filter-select">
        <option value="">Sırala</option>
        <option value="price-asc">Fiyat Artan</option>
        <option value="price-desc">Fiyat Azalan</option>
      </select>
    </div>

    <!-- Product grid -->
    <div class="grid" v-if="filtered.length">
      <ProductCard
        v-for="p in filtered"
        :key="p.id"
        :item="p"
        @detail="goToDetail"
      />
    </div>

    <p v-else class="empty-text">
      Filtrelere uygun ürün bulunamadı.
    </p>
  </section>
</template>

<style scoped>
.products-page {
  padding: 30px 0 50px;
  background: #fafafa;
}

/* Title + subtitle like a store section */
.products-header {
  text-align: center;
  margin-bottom: 20px;
}

.products-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.products-header p {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

/* Filters row */
.filters {
  max-width: 1100px;
  margin: 0 auto 18px;
  padding: 0 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-input,
.filter-select {
  min-height: 36px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  font-size: 14px;
  background: #ffffff;
  color: #111827;
}

.filter-input {
  flex: 1;
}

.filter-select {
  min-width: 160px;
}

/* Product grid similar to DeFacto layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 22px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
}

/* Empty state */
.empty-text {
  text-align: center;
  margin-top: 30px;
  color: #6b7280;
}
</style>
