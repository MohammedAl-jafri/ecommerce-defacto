<script setup>
import { ref, computed } from 'vue'

// 🔹 use your REAL pages
import Home from './Home.vue'
import Products from './Products.vue'
import Cart from './Cart.vue'
import Checkout from './Checkout.vue'
import Login from './Login.vue'
import Register from './Register.vue'
import Profile from './Profile.vue'
import ProductDetail from './ProductDetail.vue'
import FooterBar from '../components/FooterBar.vue'

// 🔹 Simple header organism – same structure as App.vue header, but static
const HeaderPreview = {
  template: `
    <header class="top">
      <div class="container">
        <div class="row">
          <div class="brand">DeFacto</div>
          <div class="grow search">
            <input
              placeholder="Ara • ürün adı…"
              aria-label="Ürün ara"
              disabled
            />
            <button class="btn btn-outline" type="button">Sepet</button>
            <button class="btn btn-outline" type="button">Giriş</button>
            <button class="btn btn-outline" type="button">Kayıt</button>
          </div>
        </div>

        <nav class="tabs">
          <a>Tişört</a>
          <a>Jean</a>
          <a>Ayakkabı</a>
          <a>Hepsi</a>
        </nav>
      </div>
    </header>
  `,
}

// 🔹 Demo ürün – sadece bileşen listesi önizlemesi için
const demoProduct = {
  id: 'demo-1',
  title: 'Demo Ürün – Örnek',
  category: 'tshirt',
  price: 299,
  image: 'https://via.placeholder.com/600x600.png?text=Demo+Product',
  description:
    'Bu sadece bileşen listesi önizlemesi için kullanılan örnek üründür.',
}

// 🔹 10 organizma / sayfa
const sections = [
  {
    id: 'header',
    order: '1',
    title: 'Header',
    subtitle: 'Logo, arama, kategori menüsü, giriş/kayıt, sepet.',
    level: 'Organizma',
  },
  {
    id: 'footer',
    order: '2',
    title: 'Footer',
    subtitle: 'Yardım linkleri, kampanya bilgileri, sosyal medya ikonları.',
    level: 'Organizma',
  },
  {
    id: 'home',
    order: '3',
    title: 'Ana Sayfa',
    subtitle: 'Kadın / Erkek / Çocuk giriş görselleri ve kampanyalar.',
    level: 'Sayfa (Önizleme)',
  },
  {
    id: 'products',
    order: '4',
    title: 'Ürünler – Filtreleme',
    subtitle: 'Kategori ve arama filtreleri ile ürün listesi.',
    level: 'Sayfa (Önizleme)',
  },
  {
    id: 'product-detail',
    order: '5',
    title: 'Ürün Detay',
    subtitle: 'Ürün fotoğrafı, fiyat ve “Sepete Ekle” alanı.',
    level: 'Sayfa (Önizleme)',
  },
  {
    id: 'cart',
    order: '6',
    title: 'Sepet',
    subtitle: 'Sepetteki ürünler ve toplam tutar.',
    level: 'Sayfa (Önizleme)',
  },
  {
    id: 'login',
    order: '7',
    title: 'Giriş',
    subtitle: 'E-posta ve şifre ile giriş formu.',
    level: 'Organizma',
  },
  {
    id: 'signup',
    order: '8',
    title: 'Kayıt Ol',
    subtitle: 'Yeni kullanıcı kayıt formu.',
    level: 'Organizma',
  },
  {
    id: 'checkout',
    order: '9',
    title: 'Checkout (Adres / Özet)',
    subtitle: 'Teslimat adresi seçimi ve sipariş özeti.',
    level: 'Sayfa (Önizleme)',
  },
  {
    id: 'profile',
    order: '10',
    title: 'Profil',
    subtitle: 'Kullanıcı bilgileri ve sipariş geçmişi.',
    level: 'Sayfa (Önizleme)',
  },
]

const activeId = ref('header')

const currentSection = computed(
  () => sections.find((s) => s.id === activeId.value) || sections[0],
)

const setActive = (id) => {
  activeId.value = id
}
</script>

<template>
  <div class="layout">
    <!-- SOL MENÜ -->
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

    <!-- SAĞ ÖNİZLEME -->
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
        <!-- ❗ Burada aynı anda SADECE BİR component render oluyor -->
        <HeaderPreview v-if="activeId === 'header'" />
        <FooterBar v-else-if="activeId === 'footer'" />
        <Home v-else-if="activeId === 'home'" />
        <Products v-else-if="activeId === 'products'" />
        <ProductDetail
          v-else-if="activeId === 'product-detail'"
          :product="demoProduct"
        />
        <Cart v-else-if="activeId === 'cart'" />
        <Login v-else-if="activeId === 'login'" />
        <Register v-else-if="activeId === 'signup'" />
        <Checkout v-else-if="activeId === 'checkout'" />
        <Profile v-else-if="activeId === 'profile'" />
      </section>

      <footer class="preview-note">
        <p>
          Bu sayfa, DeFacto hedef sitesindeki
          <strong>10 arayüz organizmasını</strong> tek yerden gösteren bir
          önizleme ekranıdır. Soldan seçim yaptığında sağda sadece seçtiğin
          bileşen gösterilir.
        </p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: calc(100vh - 60px);
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

/* preview */
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
