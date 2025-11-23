<!-- src/pages/ComponentsList.vue -->
<script setup>
import { ref, computed } from 'vue'

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

// 🔟 your 10 items from the PDF
const sections = [
  {
    id: 'header',
    order: '1',
    title: 'Header',
    subtitle: 'Logo, arama, kategori menüsü, giriş/kayıt, sepet.',
    level: 'Organizma',
    component: HeaderBar,
  },
  {
    id: 'footer',
    order: '2',
    title: 'Footer',
    subtitle: 'Yardım linkleri, kampanya bilgileri, sosyal medya ikonları.',
    level: 'Organizma',
    component: FooterBar,
  },
  {
    id: 'home',
    order: '3',
    title: 'Ana Sayfa',
    subtitle: 'Kadın / Erkek / Çocuk giriş görselleri ve kampanyalar.',
    level: 'Sayfa (Önizleme)',
    component: Home,
  },
  {
    id: 'products',
    order: '4',
    title: 'Ürünler – Filtreleme',
    subtitle: 'Kategori ve fiyat filtreleri ile ürün listeleme.',
    level: 'Sayfa (Önizleme)',
    component: Products,
  },
  {
    id: 'product-detail',
    order: '5',
    title: 'Ürün Detay',
    subtitle: 'Ürün fotoğrafı, fiyat ve “Sepete Ekle” alanı.',
    level: 'Sayfa (Önizleme)',
    // istersen ileride ProductDetail için demo component açarız
    component: Products, // şimdilik ürün listesiyle göstermek de kabul edilebilir
  },
  {
    id: 'cart',
    order: '6',
    title: 'Sepet',
    subtitle: 'Sepetimdeki ürünler ve toplam tutar.',
    level: 'Sayfa (Önizleme)',
    component: Cart,
  },
  {
    id: 'login',
    order: '7',
    title: 'Giriş',
    subtitle: 'E-posta ve şifre ile giriş sayfası.',
    level: 'Organizma',
    component: Login,
  },
  {
    id: 'register',
    order: '8',
    title: 'Kayıt Ol',
    subtitle: 'Yeni kullanıcı kayıt formu.',
    level: 'Organizma',
    component: Register,
  },
  {
    id: 'checkout',
    order: '9',
    title: 'Checkout (Adres / Özet)',
    subtitle: 'Teslimat adresi ve sipariş özeti.',
    level: 'Sayfa (Önizleme)',
    component: Checkout,
  },
  {
    id: 'profile',
    order: '10',
    title: 'Profil',
    subtitle: 'Kullanıcı bilgileri ve sipariş geçmişi.',
    level: 'Sayfa (Önizleme)',
    component: Profile,
  },
]

const activeId = ref('header')

const currentSection = computed(
  () => sections.find((s) => s.id === activeId.value) || sections[0]
)
const CurrentComponent = computed(() => currentSection.value.component)

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
            <span class="nav-level">{{ section.level }}</span>
          </div>
        </button>
      </nav>
    </aside>

    <!-- RIGHT PREVIEW -->
    <main class="preview">
      <header class="preview-header">
        <div>
          <h2 class="preview-title">
            {{ currentSection.order }} – {{ currentSection.title }}
          </h2>
          <p class="preview-subtitle">
            {{ currentSection.subtitle }}
          </p>
        </div>
        <span class="badge">
          {{ currentSection.level }}
        </span>
      </header>

      <section class="preview-box">
        <!-- 🔥 Only ONE instance of the selected component -->
        <component :is="CurrentComponent" />
      </section>

      <footer class="preview-note">
        Bu sayfa, DeFacto hedef sitesindeki
        <strong>10 arayüz organizmasını</strong> tek ekranda gösteren
        bir önizleme ekranıdır. Her satır mevcut Vue komponentini
        doğrudan kullanır, ek “demo” kodu yoktur.
      </footer>
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
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.sidebar-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.nav-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.nav-item {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
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
.nav-level {
  font-size: 11px;
  color: #9ca3af;
}

/* preview side */
.preview {
  padding: 24px 28px;
  background: #f4f4f5;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.preview-title {
  font-size: 20px;
  font-weight: 600;
}
.preview-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}
.badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #111827;
}

.preview-box {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  min-height: 340px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.preview-note {
  margin-top: 12px;
  font-size: 11px;
  color: #6b7280;
}
</style>
