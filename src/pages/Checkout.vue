<!-- src/pages/Checkout.vue -->
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
  if (!user.value) {
    router.push({
      name: 'login',
      query: { redirect: '/checkout' }, 
    })
    return
  }

  const saved = localStorage.getItem('cart')
  if (saved) {
    const parsed = JSON.parse(saved)

    items.value = parsed.map((i) => ({
      ...i,
      qty: i.qty || i.quantity || 1,
    }))
  }

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
    router.push({
      name: 'login',
      query: { redirect: '/checkout' },
    })
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
  <section class="checkout-page">
    <h1>Sipariş / Checkout</h1>
    <p class="muted intro">
      Sepetinizdeki ürünlerin özetini kontrol edin ve teslimat adresinizi girin.
    </p>

    <div class="checkout-grid">
      <!-- ORDER SUMMARY -->
      <div class="card order-card">
        <h2 class="card-title">Sipariş Özeti</h2>

        <div v-if="items.length">
          <div
            v-for="it in items"
            :key="it.id"
            class="order-row"
          >
            <div class="order-left">
              <div class="thumb-wrap" v-if="it.image">
                <img :src="it.image" :alt="it.title" />
              </div>
              <div>
                <div class="prod-title">{{ it.title }}</div>
                <div class="muted small">
                  Adet: {{ it.qty || 1 }}
                </div>
              </div>
            </div>

            <div class="order-right">
              <span class="line-price">
                {{ (it.price * (it.qty || 1)).toFixed(2) }} ₺
              </span>
            </div>
          </div>

          <div class="total-line">
            <span>Toplam:</span>
            <span class="total-value">
              {{ total.toFixed(2) }} ₺
            </span>
          </div>
        </div>

        <p v-else class="muted">
          Sepetiniz boş. Ürün eklemek için mağazaya geri dönebilirsiniz.
        </p>
      </div>

      <!-- ADDRESS + ACTION -->
      <div class="card address-card">
        <h2 class="card-title">Teslimat Adresi</h2>

        <label class="field">
          <span>Adres</span>
          <textarea
            v-model="address"
            rows="4"
            class="input"
            placeholder="Adresinizi yazınız…"
          ></textarea>
        </label>

        <label class="field">
          <span>Not (opsiyonel)</span>
          <input
            v-model="note"
            class="input"
            placeholder="Kapıya bırak, vs."
          />
        </label>

        <button
          class="submit-btn"
          @click="placeOrder"
          :disabled="loading || !items.length"
        >
          {{ loading ? 'Gönderiliyor…' : 'Siparişi Tamamla' }}
        </button>

        <p v-if="message" class="muted message">{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checkout-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 10px 60px;
  background: #fafafa;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.intro {
  margin-bottom: 22px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 20px;
}

/* cards */
.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 18px 20px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* order list */
.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.order-row:last-of-type {
  border-bottom: none;
}

.order-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.thumb-wrap {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #f3f4f6;
  overflow: hidden;
}
.thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.small {
  font-size: 12px;
}

.order-right {
  text-align: right;
}

.line-price {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}

/* total */
.total-line {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

.total-value {
  font-weight: 700;
  font-size: 18px;
  color: #111827;
}

/* address form */
.field {
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #111827;
}

.input {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
  resize: vertical;
}

.input:focus {
  border-color: #111827;
}

/* button -> DeFacto black style */
.submit-btn {
  margin-top: 6px;
  width: 100%;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: default;
}

.message {
  margin-top: 8px;
}

.muted {
  color: #94a3b8;
}

/* responsive */
@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
