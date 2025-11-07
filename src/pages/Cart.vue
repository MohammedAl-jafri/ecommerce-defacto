<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const total = ref(0)

const fallback =
  'https://via.placeholder.com/120x90.png?text=No+image'

// load cart from localStorage
const loadCart = () => {
  const raw = localStorage.getItem('cart')
  let parsed = []
  if (raw) {
    parsed = JSON.parse(raw)
  }

  // normalize each item (some old items may not have image)
  items.value = parsed.map((it) => {
    let img = it.image || ''
    img = String(img).trim()
    if (img.toLowerCase().startsWith('image:')) {
      img = img.replace(/image:\s*/i, '').trim()
    }
    if (!img) img = fallback

    return {
      id: it.id,
      title: it.title || it.name || 'Ürün',
      category: it.category || '',
      price: it.price || 0,
      image: img,
    }
  })

  total.value = items.value.reduce((sum, i) => sum + (i.price || 0), 0)
}

onMounted(loadCart)

// delete single item
const removeItem = (index) => {
  items.value.splice(index, 1)
  // write back to localStorage
  localStorage.setItem('cart', JSON.stringify(items.value))
  total.value = items.value.reduce((sum, i) => sum + (i.price || 0), 0)
}
</script>

<template>
  <section style="display:grid;gap:14px">
    <h2>Sepet</h2>

    <div v-if="items.length === 0" class="muted">
      Şu anda sepetin boş. Ürün sayfasından ekleyebilirsin.
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
            <h3>{{ item.title }}</h3>
            <p class="muted">{{ item.category }}</p>
          </div>
        </div>
        <div class="right">
          <span class="price">{{ item.price }} ₺</span>
          <button class="btn-del" @click="removeItem(idx)">Sil</button>
        </div>
      </div>

      <div class="total-line">
        Toplam: <strong>{{ total.toFixed(2) }} ₺</strong>
      </div>
    </div>

    <p class="muted" style="font-size:12px">
      Not: Bu Part-2 geçici sepet. Part-3'te Firestore sipariş kaydı yapılacak.
    </p>
  </section>
</template>

<style scoped>
.cart-list {
  display: grid;
  gap: 10px;
}

.cart-row {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background: #f3f4f6;
}

.muted {
  color: #94a3b8;
  font-size: 13px;
}

.right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.price {
  font-weight: 600;
}

.btn-del {
  background: #ffe4e6;
  color: #b91c1c;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.total-line {
  text-align: right;
  margin-top: 8px;
  font-size: 14px;
}
</style>
