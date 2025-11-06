<script setup>
import { ref, onMounted } from 'vue'

// for now we read from localStorage (key: "cart")
const items = ref([])
const total = ref(0)

const calcTotal = () => {
  total.value = items.value.reduce((sum, it) => sum + (it.price || 0), 0)
}

onMounted(() => {
  // try to load from localStorage
  const saved = localStorage.getItem('cart')
  if (saved) {
    try {
      items.value = JSON.parse(saved)
    } catch {
      items.value = []
    }
  }
  calcTotal()
})

const removeItem = (idx) => {
  items.value.splice(idx, 1)
  localStorage.setItem('cart', JSON.stringify(items.value))
  calcTotal()
}
</script>

<template>
  <section>
    <h2>Sepet</h2>
    <p class="muted" v-if="!items.length">
      Şu anda sepetin boş. Ürün sayfasından ekleyebilirsin.
    </p>

    <div v-else class="cart-list">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="cart-row"
      >
        <div>
          <strong>{{ item.title || item.name }}</strong>
          <div class="muted">{{ item.category }}</div>
        </div>
        <div class="price">{{ item.price }} ₺</div>
        <button class="btn-del" @click="removeItem(i)">Sil</button>
      </div>

      <div class="cart-total">
        Toplam: <strong>{{ total }} ₺</strong>
      </div>
    </div>

    <p class="muted" style="margin-top:1rem">
      Not: Bu Part-2 geçici sepet. Part-3'te gerçek sipariş akışı / Firestore'a yazma yapılacak.
    </p>
  </section>
</template>

<style scoped>
.muted {
  color: #94a3b8;
}
.cart-list {
  margin-top: 1rem;
  display: grid;
  gap: 8px;
}
.cart-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}
.price {
  font-weight: 600;
}
.btn-del {
  background: #ffe4e6;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  color: #b91c1c;
}
.cart-total {
  text-align: right;
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
