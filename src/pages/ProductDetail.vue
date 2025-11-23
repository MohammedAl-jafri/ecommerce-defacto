<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

// 🔹 Optional prop (used only in Components List preview)
const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
})

const route = useRoute()
const product = ref(props.product)
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
        title: data.title || data.name || 'Ürün',
        price: data.price || 0,
        category: data.category || '',
        image:
          data.image ||
          'https://via.placeholder.com/600x600?text=Product+Image',
        description: data.description || '',
        ...data,
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

// 🔹 If prop is given (preview), just use it and skip Firestore
onMounted(() => {
  if (product.value) {
    loading.value = false
    return
  }

  const id = route.params.id
  if (id) {
    loadProduct(id)
  } else {
    loading.value = false
    notFound.value = true
  }
})

// 🔹 Only react to route changes when NOT in preview mode
watch(
  () => route.params.id,
  (newId) => {
    if (!props.product && newId) {
      loadProduct(newId)
    }
  },
)
</script>

<template>
  <section class="page">
    <p v-if="loading" class="muted loading">Yükleniyor…</p>

    <div v-else-if="notFound" class="notfound">
      <h2>Ürün bulunamadı</h2>
      <p>Bu ürün veritabanında yok veya silinmiş olabilir.</p>
    </div>

    <div v-else class="detail-container">
      <div class="image-box">
        <img :src="product.image" :alt="product.title" />
      </div>

      <div class="info-box">
        <h1 class="title">{{ product.title }}</h1>

        <p class="category" v-if="product.category">
          {{ product.category }}
        </p>

        <div class="price">
          {{ product.price.toLocaleString('tr-TR') }} ₺
        </div>

        <button class="btn-solid add-btn">
          Sepete Ekle
        </button>

        <div class="desc" v-if="product.description">
          {{ product.description }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  background: #fafafa;
  padding: 40px 10px 60px;
  min-height: 60vh;
}

.detail-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

.image-box {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
}
.image-box img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.info-box {
  padding-top: 6px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.category {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 14px 0 22px;
}

.btn-solid.add-btn {
  background: #111827;
  color: #fff;
  padding: 12px 0;
  width: 100%;
  border-radius: 8px;
  font-size: 15px;
  border: none;
  cursor: pointer;
  margin-bottom: 22px;
}

.desc {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.muted {
  color: #6b7280;
}
.loading {
  text-align: center;
}
.notfound {
  text-align: center;
  padding: 40px;
}
</style>
