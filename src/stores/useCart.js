// src/stores/useCart.js
import { ref, computed } from 'vue'

const STORAGE_KEY = 'cart'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Cart localStorage error:', e)
    return []
  }
}

function isSizedCategory(mainCategory) {
  return ['women', 'men', 'kids'].includes(String(mainCategory || '').toLowerCase())
}

// ✅ مفتاح فريد للسطر داخل السلة (نفس المنتج + نفس المقاس = نفس السطر)
function makeKey(product) {
  const id = String(product?.id ?? '')
  const size = product?.size ? String(product.size) : ''
  return size ? `${id}__${size}` : id
}

const items = ref(loadFromStorage())

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

// ✅ ترقية تلقائية للعناصر القديمة (بدون key)
function migrateKeysIfNeeded() {
  let changed = false
  items.value = (items.value || []).map((it) => {
    if (!it) return it
    if (!it.key) {
      const k = makeKey(it)
      changed = true
      return { ...it, key: k }
    }
    return it
  })
  if (changed) saveToStorage()
}

migrateKeysIfNeeded()

export function useCart() {
  const count = computed(() =>
    items.value.reduce((sum, item) => sum + (Number(item.qty) || 1), 0)
  )

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0)
  )

  function addToCart(product, qty = 1) {
    if (!product || !product.id) return

    const mainCategory =
      product.mainCategory || product.cat || product.categoryMain || ''

    // ✅ إذا كان Women/Men/Kids لازم يكون فيه size
    if (isSizedCategory(mainCategory) && !product.size) return

    const rowKey = makeKey(product)
    const addQty = Math.max(1, Number(qty) || 1)

    const idx = items.value.findIndex((p) => (p.key || p.id) === rowKey)

    if (idx !== -1) {
      items.value[idx].qty = (Number(items.value[idx].qty) || 1) + addQty
    } else {
      items.value.push({
        key: rowKey,
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category || '',
        mainCategory: mainCategory || '',
        image: product.image,
        size: product.size || null,
        qty: addQty,
      })
    }

    saveToStorage()
  }

  function updateQty(keyOrId, qty) {
    const item = items.value.find((p) => (p.key || p.id) === keyOrId)
    if (!item) return
    const n = Number(qty)
    item.qty = !Number.isFinite(n) ? 1 : Math.max(1, Math.floor(n))
    saveToStorage()
  }

  function removeFromCart(keyOrId) {
    items.value = items.value.filter((p) => (p.key || p.id) !== keyOrId)
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  function setItemSize(keyOrId, newSize) {
    const idx = items.value.findIndex((p) => (p.key || p.id) === keyOrId)
    if (idx === -1) return

    const current = items.value[idx]
    const mainCategory = current.mainCategory || ''

    if (!isSizedCategory(mainCategory)) return

    const size = String(newSize || '').trim()
    if (!size) return
    if (String(current.size || '') === size) return

    const nextKey = makeKey({ ...current, size })

    const existingIdx = items.value.findIndex((p) => (p.key || p.id) === nextKey)

    if (existingIdx !== -1) {
      items.value[existingIdx].qty =
        (Number(items.value[existingIdx].qty) || 1) + (Number(current.qty) || 1)
      items.value.splice(idx, 1)
    } else {
      items.value[idx] = {
        ...current,
        size,
        key: nextKey,
      }
    }

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
    setItemSize,
    isSizedCategory,
  }
}
