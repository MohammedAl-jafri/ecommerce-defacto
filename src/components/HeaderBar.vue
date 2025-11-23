<!-- src/components/HeaderBar.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import useAuth from '../stores/useAuth'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()

const search = ref(route.query.q || '')
const isComponents = computed(() => route.name === 'components')

watch(
  () => route.query.q,
  (nv) => {
    search.value = nv || ''
  }
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
  <header class="top">
    <div class="container">
      <div class="row">
        <RouterLink to="/" class="brand">DeFacto</RouterLink>

        <div class="grow search">
          <input
            v-model="search"
            placeholder="Ara • ürün adı…"
            aria-label="Ürün ara"
            @keyup.enter="doSearch"
          />

          <RouterLink to="/cart" class="btn btn-outline">Sepet</RouterLink>
          <RouterLink to="/components" class="btn btn-outline">Components</RouterLink>

          <template v-if="!user">
            <RouterLink to="/login" class="btn btn-outline">Giriş</RouterLink>
            <RouterLink to="/register" class="btn btn-outline">Kayıt</RouterLink>
          </template>

          <template v-else>
            <RouterLink to="/profile" class="btn btn-outline">Profil</RouterLink>
            <button type="button" class="btn btn-solid" @click="handleLogout">
              Çıkış
            </button>
          </template>
        </div>
      </div>

      <nav class="tabs" v-if="!isComponents">
        <RouterLink to="/products?cat=tshirt">Tişört</RouterLink>
        <RouterLink to="/products?cat=jeans">Jean</RouterLink>
        <RouterLink to="/products?cat=shoes">Ayakkabı</RouterLink>
        <RouterLink to="/products">Hepsi</RouterLink>

        <RouterLink
          v-if="user && user.email === 'admin@DeFacto.com'"
          to="/admin"
          style="margin-left:auto"
        >
          Admin
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.top {
  background: #fff;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 60px;
}
.brand {
  font-weight: 700;
  font-size: 1.3rem;
  text-decoration: none;
  color: #222;
}
.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}
.search input {
  flex: 1;
  padding: 0.4rem 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}
.btn {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  border: 1px solid #111827;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btn-outline {
  background: #ffffff;
  color: #111827;
}
.btn-solid {
  background: #111827;
  color: #ffffff;
}
.tabs {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
}
.tabs a {
  text-decoration: none;
  color: #444;
  font-size: 0.9rem;
}
.tabs a.router-link-active {
  font-weight: 600;
  color: #111827;
}
</style>
