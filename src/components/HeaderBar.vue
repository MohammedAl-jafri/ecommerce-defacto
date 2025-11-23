<!-- src/components/HeaderBar.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import useAuth from '../stores/useAuth'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()

const search = ref(route.query.q || '')

watch(
  () => route.query.q,
  nv => search.value = nv || ''
)

const doSearch = () => {
  router.push({
    name: 'products',
    query: {
      q: search.value || undefined,
      cat: route.query.cat || undefined,
    },
  })
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <header class="df-header">
    <div class="df-container">

      <!-- LEFT: logo + main categories -->
      <div class="df-left">
        <RouterLink to="/" class="df-logo">
          DeFacto
        </RouterLink>

        <nav class="df-main-nav">
          <RouterLink to="/products?cat=women">Kadın</RouterLink>
          <RouterLink to="/products?cat=men">Erkek</RouterLink>
          <RouterLink to="/products?cat=kids">Çocuk &amp; Bebek</RouterLink>
        </nav>
      </div>

      <!-- MIDDLE: big search bar -->
      <div class="df-middle">
        <div class="df-search-wrap">
          <span class="df-search-icon"></span>
          <input
            v-model="search"
            type="text"
            placeholder="Ürün, kategori ya da marka ara"
            @keyup.enter="doSearch"
          />
        </div>
      </div>

      <!-- RIGHT: icons (giriş / favoriler / sepetim) -->
      <div class="df-right">
        <!-- Giriş / Profil -->
        <template v-if="!user">
          <RouterLink to="/login" class="df-icon-link">
            <span class="df-icon df-icon-user"></span>
            <span class="df-icon-label">Giriş</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/profile" class="df-icon-link">
            <span class="df-icon df-icon-user"></span>
            <span class="df-icon-label">Profil</span>
          </RouterLink>
          <button class="df-icon-link df-btn-plain" @click="handleLogout">
            <span class="df-icon df-icon-user"></span>
            <span class="df-icon-label">Çıkış</span>
          </button>
        </template>

        <!-- Favorilerim (şimdilik demo) -->
        <button class="df-icon-link df-btn-plain" type="button">
          <span class="df-icon df-icon-heart"></span>
          <span class="df-icon-label">Favorilerim</span>
        </button>

        <!-- Sepetim -->
        <RouterLink to="/cart" class="df-icon-link">
          <span class="df-icon df-icon-bag"></span>
          <span class="df-icon-label">Sepetim</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== HEADER WRAPPER ===== */
.df-header {
  background: #ffffff;       /* أبيض مثل الموقع الأصلي */
  border-bottom: 1px solid #eeeeee;
  padding: 10px 0;
}

.df-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1.3fr) auto;
  align-items: center;
  column-gap: 32px;
}

/* ===== LEFT: logo + nav ===== */
.df-left {
  display: flex;
  align-items: center;
  gap: 26px;
}

/* ⚠️ لا أغيّر إعدادات الخط هنا حسب طلبك */
.df-logo {
  font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
  font-size: 40px;
  font-weight: 300;
  text-transform: none;
  color: #111111;
  text-decoration: none;
  white-space: nowrap;
}

.df-main-nav {
  display: flex;
  gap: 18px;
  font-size: 14px;
}

.df-main-nav a {
  text-decoration: none;
  color: #2b2b35;
}

.df-main-nav a.router-link-active {
  font-weight: 600;
}

/* ===== MIDDLE: search ===== */
.df-middle {
  width: 100%;
}

.df-search-wrap {
  width: 100%;
  height: 40px;
  background: #f7f7f8;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  border: 1px solid #f0f0f1;
}

.df-search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #444;
}

.df-search-wrap input::placeholder {
  color: #9b9ba3;
}

/* دائرة العدسة */
.df-search-icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid #c4c4cc;
  position: relative;
}

.df-search-icon::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 2px;
  background: #c4c4cc;
  border-radius: 999px;
  right: -4px;
  bottom: -1px;
  transform: rotate(40deg);
}

/* ===== RIGHT: icons ===== */
.df-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.df-icon-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.df-btn-plain {
  font: inherit;
}

/* دوائر الأيقونات */
.df-icon {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid #111111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* user icon: دائرة + خط صغير */
.df-icon-user::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 1px solid #111111;
  position: absolute;
  top: 5px;
}

.df-icon-user::after {
  content: "";
  width: 12px;
  height: 6px;
  border-radius: 999px 999px 0 0;
  border: 1px solid #111111;
  border-bottom: none;
  position: absolute;
  bottom: 5px;
}

/* heart icon */
.df-icon-heart::before {
  content: "♥";
  font-size: 15px;
}

/* bag icon (sepet) */
.df-icon-bag::before {
  content: "";
  width: 10px;
  height: 9px;
  border-radius: 2px;
  border: 1px solid #111111;
  position: absolute;
  bottom: 5px;
}

.df-icon-bag::after {
  content: "";
  width: 5px;
  height: 6px;
  border-radius: 999px;
  border: 1px solid #111111;
  border-top: none;
  position: absolute;
  top: 5px;
}

/* label تحت/جنب الأيقونة */
.df-icon-label {
  font-size: 13px;
  color: #111111;
}

/* صغير للموبايل */
@media (max-width: 900px) {
  .df-container {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    row-gap: 10px;
  }

  .df-middle {
    grid-column: 1 / -1;
    order: 2;
  }

  .df-left {
    gap: 10px;
  }

  .df-main-nav {
    display: none; /* لو حبيت تبقيها في الموبايل عدّل هذا */
  }
}
</style>
