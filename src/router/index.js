// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Products from '../pages/Products.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import Cart from '../pages/Cart.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import Admin from '../pages/Admin.vue'
import Checkout from '../pages/Checkout.vue'
import NotFound from '../pages/NotFound.vue'

import { auth } from '../firebase'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/products', name: 'products', component: Products },
  { path: '/product/:id', name: 'product', component: ProductDetail, props: true },
  { path: '/cart', name: 'cart', component: Cart },

  // 🔐 Checkout must be protected
  { path: '/checkout', name: 'checkout', component: Checkout, meta: { requiresAuth: true } },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },

  // 🔐 Profile is protected
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },

  // 🔐 Admin pages
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAdmin: true } },
  { path: '/admin-orders', name: 'admin-orders', component: () => import('../pages/AdminOrders.vue'), meta: { requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior () {
    return { top: 0 }
  },
})

const ADMIN_EMAIL = 'admin@shopvue.com'

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser

  // 🔐 If route requires login but user not logged in
  if (to.meta.requiresAuth && !currentUser) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath } // so user returns after login
    })
  }

  // 🔐 Admin routes
  if (to.meta.requiresAdmin) {
    if (!currentUser) {
      return next({ name: 'login' })
    }
    if (currentUser.email !== ADMIN_EMAIL) {
      return next({ name: 'home' }) // block non-admins
    }
  }

  next()
})

export default router