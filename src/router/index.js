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

// ⭐ Components list main page
import ComponentsList from '../pages/ComponentsList.vue'

import { auth } from '../firebase'

const routes = [
  // Landing page -> Components list
  { path: '/', redirect: '/components' },

  { path: '/components', name: 'components', component: ComponentsList },

  { path: '/products', name: 'products', component: Products },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductDetail,
    props: true,
  },
  { path: '/cart', name: 'cart', component: Cart },

  // 🔐 Protected
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true },
  },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },

  // 🔐 Profile protected
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },

  // 🔐 Admin
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin-orders',
    name: 'admin-orders',
    component: () => import('../pages/AdminOrders.vue'),
    meta: { requiresAdmin: true },
  },

  // 404
  { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// ❗  lowercase
const ADMIN_EMAIL = 'admin@defacto.com'

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser

  console.log('currentUser in guard =', currentUser?.email)

  if (to.meta.requiresAuth && !currentUser) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  //  admin
  if (to.meta.requiresAdmin) {
    if (!currentUser) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    const userEmail = (currentUser.email || '').toLowerCase().trim()

    if (userEmail !== ADMIN_EMAIL) {
      return next({ name: 'components' })
    }
  }

  next()
})

export default router
