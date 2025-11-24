<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const total = ref(0)

const fallback =
  'https://via.placeholder.com/120x90.png?text=No+image'

const recalcTotal = () => {
  total.value = items.value.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0
  )
}

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(items.value))
  recalcTotal()
}

// 🔹 load + normalize + MERGE duplicates
const loadCart = () => {
  const raw = localStorage.getItem('cart')
  let parsed = []
  if (raw) {
    parsed = JSON.parse(raw)
  }

  const map = new Map()

  for (const it of parsed) {
    if (!it || !it.id) continue

    // normalize image
    let img = it.image || ''
    img = String(img).trim()
    if (img.toLowerCase().startsWith('image:')) {
      img = img.replace(/image:\s*/i, '').trim()
    }
    if (!img) img = fallback

    const qty = it.qty || it.quantity || 1
    const id = it.id

    if (map.has(id)) {
      const existing = map.get(id)
      existing.qty += qty
    } else {
      map.set(id, {
        id,
        title: it.title || it.name || 'Ürün',
        category: it.category || '',
        price: it.price || 0,
        image: img,
        qty,
      })
    }
  }

  items.value = Array.from(map.values())
  saveCart() // also normalizes localStorage
}

onMounted(loadCart)

// delete line (tüm adeti siler)
const removeItem = (index) => {
  items.value.splice(index, 1)
  saveCart()
}

// 🔼 adet artır
const increaseQty = (index) => {
  const item = items.value[index]
  if (!item) return
  item.qty = (item.qty || 1) + 1
  saveCart()
}

// 🔽 adet azalt (1'den aşağı inerse ürünü tamamen sil)
const decreaseQty = (index) => {
  const item = items.value[index]
  if (!item) return
  if ((item.qty || 1) > 1) {
    item.qty -= 1
    saveCart()
  } else {
    
    removeItem(index)
  }
}
</script>

<template>
  <section class="cart-page">
    <h1>Sepet</h1>

    <div v-if="items.length === 0" class="empty">
      Sepetiniz boş. Ürün eklemek için mağazaya göz atın.
    </div>

    <div v-else class="cart-list">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="cart-row"
      >
        <div class="left">
          <img :src="item.image" :alt="item.title" class="thumb" />
          <div>
            <h3 class="title">{{ item.title }}</h3>
            <p class="cat">{{ item.category }}</p>
          </div>
        </div>

        <div class="right">
          <div class="price-block">
            <span class="price">{{ item.price }} ₺</span>
            <div class="qty-controls">
              <button class="qty-btn" @click="decreaseQty(idx)">-</button>
              <span class="qty-value">{{ item.qty }}</span>
              <button class="qty-btn" @click="increaseQty(idx)">+</button>
            </div>
          </div>

          <button class="btn-del" @click="removeItem(idx)">Sil</button>
        </div>
      </div>

      <div class="total-box">
        <p>Toplam:</p>
        <h2>{{ total.toFixed(2) }} ₺</h2>
      </div>

      <!-- ✅ NEW: Checkout button -->
      <div class="checkout-wrap">
        <RouterLink to="/checkout" class="checkout-btn">
          Ödemeye Geç
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 10px;
  background: #fafafa;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  margin: 40px 0;
  color: #6b7280;
  font-size: 15px;
}

/* Cart item rows */
.cart-list {
  display: grid;
  gap: 14px;
}

.cart-row {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.03);
}

.left {
  display: flex;
  gap: 14px;
  align-items: center;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: cover;
  background: #f3f4f6;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.cat {
  color: #6b7280;
  font-size: 13px;
}

.right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.price-block {
  text-align: right;
}

/* price */
.price {
  font-weight: 600;
  color: #111827;
  font-size: 15px;
  display: block;
}

/* 🔢 DeFacto-style quantity controls */
.qty-controls {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  overflow: hidden;
  background: #ffffff;
}

.qty-btn {
  width: 28px;
  height: 24px;
  border: none;
  background: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.qty-value {
  min-width: 28px;
  text-align: center;
  font-size: 13px;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}

/* Delete button → black/white */
.btn-del {
  background: #ffffff;
  border: 1px solid #111827;
  color: #111827;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

/* Total box */
.total-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  margin-top: 10px;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: right;
}

.total-box p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.total-box h2 {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

/* ✅ NEW: checkout button */
.checkout-wrap {
  text-align: right;
  margin-top: 10px;
}

.checkout-btn {
  display: inline-block;
  background: #111827;
  color: #ffffff;
  padding: 10px 22px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
</style>
