<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import useAuth from '../stores/useAuth'

const router = useRouter()
const { user } = useAuth()

// cart
const items = ref([])
const address = ref('')
const note = ref('')
const message = ref('')
const loading = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('cart')
  if (saved) {
    const parsed = JSON.parse(saved)

    // 🔹 normalize: make sure every item has qty
    items.value = parsed.map(i => ({
      ...i,
      qty: i.qty || i.quantity || 1, // supports old data too
    }))
  }

  // If cart is empty → send to /cart
  if (!items.value.length) {
    router.push('/cart')
  }
})

// total price
const total = computed(() =>
  items.value.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  )
)

// place order
const placeOrder = async () => {
  message.value = ''

  if (!address.value) {
    message.value = 'Adres zorunludur.'
    return
  }

  if (!user.value) {
    // should not happen because route is protected, but safety
    router.push('/login')
    return
  }

  loading.value = true

  try {
    const orderData = {
      userId: user.value.uid,
      userEmail: user.value.email,
      address: address.value,
      note: note.value,
      items: items.value.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        // 🔹 we keep "quantity" field in Firestore,
        //   but read the value from local qty
        quantity: i.qty || 1,
        image: i.image,
      })),
      total: total.value,
      createdAt: serverTimestamp(),
    }

    await addDoc(collection(db, 'orders'), orderData)

    // clear cart
    localStorage.removeItem('cart')
    items.value = []

    // go to profile
    router.push('/profile')
  } catch (err) {
    console.error(err)
    message.value = 'Sipariş oluşturulurken hata oluştu!'
  } finally {
    loading.value = false
  }
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
          <span>{{ it.title }} (x{{ it.qty || 1 }})</span>
          <span>{{ (it.price * (it.qty || 1)).toFixed(2) }} ₺</span>
        </div>
        <div style="text-align:right;margin-top:6px">
          <strong>Toplam: {{ total.toFixed(2) }} ₺</strong>
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
        <input
          v-model="note"
          class="btn"
          style="width:100%"
          placeholder="Kapıya bırak, vs."
        />
      </label>

      <button
        @click="placeOrder"
        :disabled="loading"
        style="background:#111827;color:white;border:none;padding:8px;border-radius:8px;cursor:pointer"
      >
        {{ loading ? 'Gönderiliyor…' : 'Siparişi Tamamla' }}
      </button>

      <p v-if="message" class="muted">{{ message }}</p>
    </div>
  </section>
</template>

<style scoped>
.muted {
  color: #94a3b8;
}
</style>
