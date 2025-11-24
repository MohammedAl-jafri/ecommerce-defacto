<!--
  Project: DeFacto E-Commerce (Vue + Firebase)
  Prepared by: Mohammed Khalid Abdullah Al-Jafri
  Student No: 210101088
  Date: 2025-11-24
-->


<!-- src/App.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'
import FooterBar from './components/FooterBar.vue'

const route = useRoute()
const isComponents = computed(() => route.name === 'components')
</script>

<template>
  <div>
    <!-- Global header + footer ONLY outside /components -->
    <HeaderBar v-if="!isComponents" />

    <main>
      <div :class="isComponents ? 'fullpage' : 'container'">
        <RouterView />
      </div>
    </main>

    <FooterBar v-if="!isComponents" />
  </div>
</template>

<style>
body {
  background: #f5f5f5;
  font-family: "Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

/* /components: we want *only* the Components List page */
.fullpage {
  min-height: 100vh;
  padding: 0;
}
</style>
