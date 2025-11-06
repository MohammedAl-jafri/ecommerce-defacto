<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const notFound = ref(false)

const loadProduct = async (id) => {
  loading.value = true
  notFound.value = false
  try {
    const refDoc = doc(db, 'products', id)
    const snap = await getDoc(refDoc)
    if (snap.exists()) {
      const data = snap.data()
      product.value = {
        id: snap.id,
        // normalize field names so template doesn’t break
        title: data.title || data.name || 'Ürün',
        price: data.price || 0,
        category: data.category || '',
        image: data.image || 'https://via.placeholder.com/600x600?text=Product',
        description: data.description || '',
        ...data
      }
    } else {
      product.value = null
      notFound.value = true
    }
  } catch (err) {
    console.error('Ürün alınamadı:', err)
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct(route.params.id)
})

// if user navigates from /product/a → /product/b without full reload
watch(
  () => route.params.id,
  (newId) => {
    if (newId) loadProduct(newId)
  }
)
</script>

<template>
  <!-- loading -->
  <p v-if="loading" class="muted">Yükleniyor…</p>

  <!-- not found -->
  <div v-else-if="notFound" class="muted">
    <h2>Ürün bulunamadı</h2>
    <p>Bu ürün veritabanında yok veya silinmiş olabilir.</p>
  </div>

  <!-- product -->
  <div
    v-else
    style="display:grid;grid-template-columns:1fr 1fr;gap:24px"
  >
    <img
      :src="product.image"
      :alt="product.title"
      style="width:100%;border-radius:12px;border:1px solid #e5e7eb"
    />
    <div>
      <h1>{{ product.title }}</h1>
      <div class="muted" v-if="product.category">
        Kategori: {{ product.category }}
      </div>
      <p class="price">
        {{ product.price.toLocaleString('tr-TR') }} ₺
      </p>
      <button class="btn cta">Sepete Ekle</button>

      <p class="muted" style="margin-top:1rem" v-if="product.description">
        {{ product.description }}
      </p>
      <p class="muted" style="margin-top:1rem">
        Part-2: Bu sayfa Firestore'dan besleniyor.
      </p>
    </div>
  </div>
</template>

<style scoped>
.muted {
  color: #6b7280;
}
.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f97316;
  margin: 0.6rem 0 1rem;
}
.btn.cta {
  background: #111827;
  color: #fff;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
