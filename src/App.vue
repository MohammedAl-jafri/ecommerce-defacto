<!-- src/App.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'
import FooterBar from './components/FooterBar.vue'
import CartToast from './components/CartToast.vue'

const route = useRoute()

// صفحة components
const isComponents = computed(() => route.name === 'components')

// صفحات الدخول / التسجيل
const isAuth = computed(
  () => route.name === 'login' || route.name === 'register'
)

// صفحة السلة
const isCart = computed(
  () => route.name === 'cart' || route.path === '/cart'
)

// صفحة الدفع
const isCheckout = computed(
  () => route.name === 'checkout' || route.path === '/checkout'
)

const isProducts = computed(
  () => route.name === 'products' || route.path.startsWith('/products')
)

const isHome = computed(() => route.name === 'home' || route.path === '/' || route.path.startsWith('/home'))

const isFavorites = computed(() => route.name === 'favorites' || route.path === '/favorites')

const isProductDetail = computed(() => route.name === 'product' || route.path.startsWith('/product/'))


// كل الصفحات اللي نبيها Full Page
const isFullPage = computed(
  () =>
    isComponents.value ||
    isAuth.value ||
    isCart.value ||
    isCheckout.value ||
    isProducts.value ||
    isHome.value ||
    isFavorites.value ||
    isProductDetail.value
)
</script>

<template>
  <div>
    <!-- الهيدر مخفي فقط في صفحة components -->
    <HeaderBar v-if="!isComponents && !isHome" />

    <CartToast />

    <main :class="['app-main', { 'app-main--full': isFullPage }]">
      <div :class="isFullPage ? 'fullpage' : 'container'">
        <RouterView v-slot="{ Component }">
          <KeepAlive include="ComponentsList">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </main>

    <!-- الفوتر مخفي فقط في صفحة components -->
    <FooterBar v-if="!isComponents && !isCheckout && !isHome" />
  </div>
</template>

<style>
body {
  background: #f5f5f5;
  font-family: "Montserrat", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

/* الصفحات العادية */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

/* الصفحات fullpage */
.fullpage {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}

/* main الافتراضي */
.app-main {
  background: transparent;
}

/* main لما تكون الصفحة fullpage */
.app-main--full {
  background: #ffffff;
}
</style>
