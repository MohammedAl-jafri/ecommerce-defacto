<!-- src/pages/NotFound.vue -->
<template>
  <section class="nf">
    <h1>404</h1>
    <p>Aradığınız sayfa bulunamadı.</p>
    <RouterLink to="/" class="btn">Ana sayfaya dön</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.nf {
  min-height: 50vh;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 12px;
}
h1 {
  font-size: 64px;
  font-weight: 800;
  color: #0f172a;
}
p {
  color: #6b7280;
}
.btn {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
}
</style>
