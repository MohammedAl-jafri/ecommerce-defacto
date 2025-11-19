<script setup>
import { computed, ref, watch } from 'vue'
import useAuth from '../stores/useAuth'
import { db } from '../firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

const { user, ready, logout } = useAuth()

const email = computed(() => user.value?.email || '')
const name = computed(() => user.value?.displayName || 'Misafir')

const orders = ref([])
const loadingOrders = ref(false)

const loadOrders = async () => {
  if (!user.value) return
  loadingOrders.value = true
  try {
    const qRef = query(
      collection(db, 'orders'),
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(qRef)
    orders.value = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loadingOrders.value = false
  }
}

// when auth ready & user available, load orders
watch(
  () => ({ ready: ready.value, uid: user.value?.uid }),
  (val) => {
    if (val.ready && val.uid) {
      loadOrders()
    }
  },
  { immediate: true }
)

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <section class="profile-wrapper">
    <h2>Profil</h2>

    <div v-if="!ready" class="muted">Yükleniyor…</div>

    <div v-else-if="!email" class="muted">
      Giriş yapmamışsınız. Lütfen önce giriş yapın.
    </div>

    <div v-else class="card">
      <p><strong>İsim:</strong> {{ name }}</p>
      <p><strong>E-posta:</strong> {{ email }}</p>

      <button class="danger" @click="handleLogout">Çıkış Yap</button>

      <h3 style="margin-top:16px;">Siparişlerim</h3>
      <div v-if="loadingOrders" class="muted">Siparişler yükleniyor…</div>
      <div v-else-if="orders.length === 0" class="muted">
        Henüz bir siparişiniz yok.
      </div>
      <ul v-else class="orders">
        <li v-for="o in orders" :key="o.id">
          <div>
            <strong>{{ o.total?.toFixed(2) }} ₺</strong>
            <div class="muted">
              {{ o.items?.length || 0 }} ürün
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.profile-wrapper {
  max-width: 480px;
  margin: 0 auto;
  padding: 32px 12px;
  display: grid;
  gap: 16px;
}
.card {
  background: #fff;
  padding: 18px 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
  display: grid;
  gap: 8px;
}
.danger {
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}
.muted {
  color: #94a3b8;
  font-size: 14px;
}
.orders {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: grid;
  gap: 8px;
}
.orders li {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
