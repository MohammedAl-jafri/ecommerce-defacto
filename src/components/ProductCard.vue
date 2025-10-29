<script setup>
const props = defineProps({ item: { type: Object, required: true } })
</script>

<template>
  <div class="card">
    <RouterLink :to="`/products/${item.id}`">
      <img :src="item.image" :alt="item.title" loading="lazy" />
    </RouterLink>
    <div class="pad">
      <RouterLink :to="`/products/${item.id}`"><strong>{{ item.title }}</strong></RouterLink>
      <div class="muted">{{ item.category }}</div>
      <div class="price">{{ item.price.toLocaleString('tr-TR') }} ₺</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <RouterLink class="btn cta" :to="`/products/${item.id}`">Detay</RouterLink>
        <RouterLink class="btn" to="/cart">Sepete Ekle</RouterLink>
      </div>
    </div>
  </div>
</template>
