<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const total = ref(0)

onMounted(() => {
  const saved = localStorage.getItem('cart')
  if (saved) {
    items.value = JSON.parse(saved)
  }
  total.value = items.value.reduce((s, i) => s + (i.price || 0), 0)
})

const address = ref('')
const note = ref('')
const message = ref('')

const placeOrder = () => {
  if (!address.value) {
    message.value = 'Adres zorunludur.'
    return
  }
  // Part-3: burada Firestore'a sipariş kaydı yapılacak
  message.value = 'Demo: Sipariş alındı (yerel).'
}
</script>

<template>
  <section style="max-width:720px;margin:0 auto;display:grid;gap:16px">
    <h2>Sipariş / Checkout</h2>
    <p class="muted">Sepetinizdeki ürünlerin özetini ve adresinizi girin.</p>

    <!-- order summary -->
    <div
      style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;display:grid;gap:8px"
    >
      <h3>Sipariş Özeti</h3>
      <div v-if="items.length">
        <div
          v-for="it in items"
          :key="it.id"
          style="display:flex;justify-content:space-between"
        >
          <span>{{ it.title }}</span>
          <span>{{ it.price }} ₺</span>
        </div>
        <div style="text-align:right;margin-top:6px">
          <strong>Toplam: {{ total }} ₺</strong>
        </div>
      </div>
      <p v-else class="muted">Sepetiniz boş.</p>
    </div>

    <!-- address -->
    <div
      style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;display:grid;gap:10px"
    >
      <h3>Adres Bilgisi</h3>
      <textarea
        v-model="address"
        rows="3"
        class="btn"
        style="width:100%"
        placeholder="Adresinizi yazınız…"
      ></textarea>

      <label>
        Not
        <input v-model="note" class="btn" style="width:100%" placeholder="Kapıya bırak, vs." />
      </label>

      <button
        @click="placeOrder"
        style="background:#ff8400;color:white;border:none;padding:8px;border-radius:8px;cursor:pointer"
      >
        Siparişi Tamamla
      </button>

      <p v-if="message" class="muted">{{ message }}</p>
    </div>

    <p class="muted" style="font-size:12px">
      Not: Vize sonrası bu sayfa Firestore sipariş koleksiyonuna yazacak.
    </p>
  </section>
</template>

<style scoped>
.muted {
  color: #94a3b8;
}
</style>
