// src/stores/useFavorites.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'shop-favorites'

export const useFavorites = defineStore('favorites', () => {
  const items = ref([])

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        items.value = JSON.parse(raw)
      }
    } catch (e) {
      console.error('Fav storage parse error', e)
    }
  }

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  const isFav = (product) => {
    if (!product) return false
    return items.value.some(
      (p) =>
        (p.id && p.id === product.id) ||
        (p.productId && p.productId === product.productId),
    )
  }

  const toggleFavorite = (product) => {
    if (!product) return
    const idx = items.value.findIndex(
      (p) =>
        (p.id && p.id === product.id) ||
        (p.productId && p.productId === product.productId),
    )

    if (idx !== -1) {
      items.value.splice(idx, 1)          // موجود → نحذفه
    } else {
      items.value.unshift(product)        // غير موجود → نضيفه
    }
  }

  const count = computed(() => items.value.length)

  loadFromStorage()
  watch(items, saveToStorage, { deep: true })

  return { items, count, isFav, toggleFavorite }
})
