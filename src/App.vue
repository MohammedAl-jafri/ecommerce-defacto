<script setup>
</script>

<template>
  <header class="top">
    <div class="container">
      <div class="row">
        <RouterLink to="/" class="brand">ShopVue</RouterLink>
        <div class="grow search">
          <input
            placeholder="Ara • ürün adı…"
            @keyup.enter="$router.push({ name: 'products', query: { q: $event.target.value } })"
            aria-label="Ürün ara"
          />
          <RouterLink to="/cart" class="btn">Sepet</RouterLink>
          <RouterLink to="/login" class="btn">Giriş</RouterLink>
        </div>
      </div>
      <nav class="tabs">
        <RouterLink to="/products?cat=tshirt">Tişört</RouterLink>
        <RouterLink to="/products?cat=jeans">Jean</RouterLink>
        <RouterLink to="/products?cat=shoes">Ayakkabı</RouterLink>
        <RouterLink to="/products">Hepsi</RouterLink>
        <RouterLink to="/admin" style="margin-left:auto">Admin</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>

  <footer class="container">
    <p class="muted">
      Part-1 starter • Vue + Router + Mock Data • Deploy to Bekent later
    </p>
  </footer>
</template>

<style>
body {
  background: #f5f5f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

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
}

.search input {
  flex: 1;
  padding: 0.4rem 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}

.btn {
  background: #ff6b00;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
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
  color: #ff6b00;
}

.muted {
  color: #999;
  font-size: 0.8rem;
  padding: 1.5rem 0;
}
</style>
