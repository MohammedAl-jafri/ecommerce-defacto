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
      image: data.image || '', // optional
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
  <section style="display:grid;gap:12px">
    <div style="display:flex;gap:8px;align-items:center">
      <input v-model="q" placeholder="Ara…" class="btn" style="flex:1" />

      <select v-model="cat" class="btn" style="min-width:140px">
        <option value="">Kategori: Hepsi</option>
        <!-- make sure these match Firestore categories -->
        <option value="clothing">Clothing</option>
        <option value="tshirt">Tişört</option>
        <option value="jeans">Jean</option>
        <option value="shoes">Ayakkabı</option>
      </select>

      <select v-model="sort" class="btn" style="min-width:160px">
        <option value="">Sırala</option>
        <option value="price-asc">Fiyat Artan</option>
        <option value="price-desc">Fiyat Azalan</option>
      </select>
    </div>

    <div class="grid">
      <ProductCard v-for="p in filtered" :key="p.id" :item="p" />
    </div>
  </section>
</template>
