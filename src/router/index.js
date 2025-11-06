import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Products from '../pages/Products.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import Cart from '../pages/Cart.vue'
import Login from '../pages/Login.vue'
import Admin from '../pages/Admin.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/products', name: 'products', component: Products },
  { path: '/product/:id', name: 'product', component: ProductDetail, props: true },
  { path: '/cart', name: 'cart', component: Cart },
  { path: '/login', name: 'login', component: Login },
  { path: '/admin', name: 'admin', component: Admin },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
