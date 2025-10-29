<script setup>
</script>

<template>
  <header class="top">
    <div class="container">
      <div class="row">
        <RouterLink to="/" class="brand">ShopVue</RouterLink>
        <div class="grow search">
          <input placeholder="Ara • ürün adı…" @input="$router.push({name:'products', query:{q:$event.target.value}})" />
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
    <p class="muted">Part-1 starter • Vue + Router + Mock Data • Deploy to Bekent later</p>
  </footer>
</template>
