// src/stores/useCart.js
import { ref, computed } from 'vue'

const STORAGE_KEY = 'cart'

// نحمل البيانات من localStorage مرة واحدة
const items = ref(loadFromStorage())

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Cart localStorage error:', e)
    return []
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

export function useCart() {
  // مجموع الكميات
  const count = computed(() =>
    items.value.reduce((sum, item) => sum + (item.qty || 1), 0)
  )

  // مجموع السعر
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * (item.qty || 1), 0)
  )

  function addToCart(product, qty = 1) {
    if (!product || !product.id) return

    const idx = items.value.findIndex((p) => p.id === product.id)

    if (idx !== -1) {
      items.value[idx].qty = (items.value[idx].qty || 1) + qty
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category || '',
        image: product.image,
        qty,
      })
    }

    saveToStorage()
  }

  function updateQty(id, qty) {
    const item = items.value.find((p) => p.id === id)
    if (!item) return
    item.qty = qty < 1 ? 1 : qty
    saveToStorage()
  }

  function removeFromCart(id) {
    items.value = items.value.filter((p) => p.id !== id)
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  return {
    items,
    count,
    total,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  }
}
