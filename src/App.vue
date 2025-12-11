<!-- src/App.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'
import FooterBar from './components/FooterBar.vue'
import CartToast from './components/CartToast.vue'

const route = useRoute()

// صفحة الـ components (قائمة الكومبوننت)
const isComponents = computed(() => route.name === 'components')

// صفحات الدخول/التسجيل
const isAuth = computed(() => route.name === 'login' || route.name === 'register')

// صفحة السلة (بناءً على الاسم أو المسار)
const isCart = computed(
  () => route.name === 'cart' || route.path === '/cart'
)

// الصفحات التي نريدها فل سكرين (components + login + register + cart)
const isFullPage = computed(() => isComponents.value || isAuth.value || isCart.value)
</script>

<template>
  <div>
    <!-- الهيدر يظهر في كل الصفحات ما عدا صفحة components فقط -->
    <HeaderBar v-if="!isComponents" />

    <CartToast />

    <main>
      <div :class="isFullPage ? 'fullpage' : 'container'">
        <RouterView v-slot="{ Component }">
          <KeepAlive include="ComponentsList">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </main>

    <!-- الفوتر أيضاً مخفي فقط في صفحة components -->
    <FooterBar v-if="!isComponents" />
  </div>
</template>

<style>
body {
  background: #f5f5f5;
  font-family: "Montserrat", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.fullpage {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}
</style>
