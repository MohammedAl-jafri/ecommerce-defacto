<!-- src/pages/ComponentsList.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'

// 🔹 ORIGINAL components/pages
import HeaderBar from '../components/HeaderBar.vue'
import FooterBar from '../components/FooterBar.vue'
import Home from './Home.vue'
import Products from './Products.vue'
import Cart from './Cart.vue'
import Checkout from './Checkout.vue'
import Login from './Login.vue'
import Register from './Register.vue'
import Profile from './Profile.vue'
import ProductDetail from './ProductDetail.vue'   
// 🔹 Firestore
import { db } from '../firebase'
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore'

const PREVIEW_PRODUCT_ID = 7

const detailProduct = ref(null)
const detailLoading = ref(true)

onMounted(async () => {
  try {
    const qRef = query(
      collection(db, 'products'),
      where('productId', '==', PREVIEW_PRODUCT_ID),
      limit(1)
    )
    const snap = await getDocs(qRef)

    if (!snap.empty) {
      const d = snap.docs[0]
      const data = d.data()

      detailProduct.value = {
        id: d.id,
        title: data.title || data.name || 'Ürün',
        price: data.price || 0,
        category: data.category || '',
        image:
          (data.image || '')
            .toString()
            .trim()
            .replace(/^image:\s*/i, '') ||
          'https://via.placeholder.com/600x600?text=Product+Image',
        description: data.description || '',
        ...data,
      }
    } else {
      console.warn('Bu productId için ürün bulunamadı:', PREVIEW_PRODUCT_ID)
      detailProduct.value = null
    }
  } catch (err) {
    console.error('Ürün Detay için ürün alınamadı:', err)
    detailProduct.value = null
  } finally {
    detailLoading.value = false
  }
})

const sections = [
  {
    id: 'header',
    order: '1',
    title: 'Header',
    subtitle: 'Logo, arama, kategori menüsü, giriş/kayıt, sepet.',
    component: HeaderBar,
  },
  {
    id: 'footer',
    order: '2',
    title: 'Footer',
    subtitle: 'Yardım linkleri, kampanya bilgileri, sosyal medya ikonları.',
    component: FooterBar,
  },
  {
    id: 'home',
    order: '3',
    title: 'Ana Sayfa',
    subtitle: 'Kadın / Erkek / Çocuk giriş görselleri ve kampanyalar.',
    component: Home,
  },
  {
    id: 'products',
    order: '4',
    title: 'Ürünler – Filtreleme',
    subtitle: 'Kategori ve fiyat filtreleri ile ürün listeleme.',
    component: Products,
  },
  {
    id: 'product-detail',
    order: '5',
    title: 'Ürün Detay',
    subtitle: 'Ürün fotoğrafı, fiyat ve “Sepete Ekle”.',
    component: ProductDetail,   
  },
  {
    id: 'cart',
    order: '6',
    title: 'Sepet',
    subtitle: 'Sepetimdeki ürünler ve toplam tutar.',
    component: Cart,
  },
  {
    id: 'login',
    order: '7',
    title: 'Giriş Yap (Login)',
    subtitle: 'E-posta ve şifre ile giriş.',
    component: Login,
  },
  {
    id: 'register',
    order: '8',
    title: 'Kayıt Ol (Sign Up)',
    subtitle: 'Yeni kullanıcı kayıt formu.',
    component: Register,
  },
  {
    id: 'checkout',
    order: '9',
    title: 'Checkout (Adres / Özet)',
    subtitle: 'Teslimat adresi ve sipariş özeti.',
    component: Checkout,
  },
  {
    id: 'profile',
    order: '10',
    title: 'Profil',
    subtitle: 'Kullanıcı bilgileri ve geçmiş.',
    component: Profile,
  },
]

const activeId = ref('header')

const currentSection = computed(
  () => sections.find((s) => s.id === activeId.value) || sections[0]
)
const CurrentComponent = computed(() => currentSection.value.component)

const currentProps = computed(() => {
  if (currentSection.value.id === 'product-detail' && detailProduct.value) {
    return { product: detailProduct.value }
  }
  return {}
})

const setActive = (id) => {
  activeId.value = id
}
</script>

<template>
  <div class="layout">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <h1 class="logo">DeFacto</h1>
      <p class="sidebar-subtitle">Component List</p>

      <nav class="nav-list">
        <button
          v-for="section in sections"
          :key="section.id"
          class="nav-item"
          :class="{ 'nav-item--active': section.id === activeId }"
          @click="setActive(section.id)"
        >
          <span class="nav-order">{{ section.order }}.</span>

          <div class="nav-texts">
            <span class="nav-title">{{ section.title }}</span>
          </div>
        </button>
      </nav>
    </aside>

    <!-- RIGHT: ONLY THE REAL COMPONENT -->
    <main class="preview-plain">
      <div v-if="currentSection.id === 'product-detail' && detailLoading" class="preview-loading">
        Ürün detayı yükleniyor…
      </div>

      <ProductDetail
        v-else-if="currentSection.id === 'product-detail' && detailProduct"
        :product="detailProduct"
      />

      <div
        v-else-if="currentSection.id === 'product-detail' && !detailProduct && !detailLoading"
        class="preview-loading"
      >
        Gösterilecek ürün bulunamadı (productId = {{ PREVIEW_PRODUCT_ID }})
      </div>

      <component
        v-else
        :is="CurrentComponent"
        v-bind="currentProps"
      />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f4f4f5;
  color: #111827;
}

/* sidebar */
.sidebar {
  background: #111827;
  color: #f9fafb;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
}
.logo {
  font-size: 40px;
  font-weight: 300;
}
.sidebar-subtitle {
  margin-top: 4px;
  font-size: 15px;
  color: #9ca3af;
}

.nav-list {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  width: 100%;
  border: 8px solid transparent;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 1px;
  background: #020617;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: all 0.15s ease;
}

.nav-item:hover {
  border-color: #4b5563;
}

.nav-item--active {
  background: #f9fafb;
  color: #111827;
  border-color: #111827;
}

.nav-order {
  font-weight: 600;
  min-width: 18px;
}

.nav-texts {
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-weight: 500;
}

.preview-plain {
  background: #f4f4f5;
  padding: 0;
}

.preview-loading {
  padding: 16px;
  color: #6b7280;
  font-size: 14px;
}
</style>
