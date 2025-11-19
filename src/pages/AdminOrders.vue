<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(qOrders)

    orders.value = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error("Orders could not be loaded:", err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section style="max-width:900px;margin:auto;padding:20px">
    <h1>Admin • Orders</h1>
    <p class="muted">All orders from Firestore (latest first)</p>

    <div v-if="loading">Loading orders…</div>

    <div v-else>
      <div
        v-for="o in orders"
        :key="o.id"
        class="order-card"
      >
        <div class="order-header">
          <strong>Order #{{ o.id }}</strong>
          <span>{{ new Date(o.createdAt?.seconds * 1000).toLocaleString() }}</span>
        </div>

        <p><strong>User:</strong> {{ o.userEmail }}</p>
        <p><strong>Total:</strong> {{ o.total }} ₺</p>
        <p><strong>Items:</strong> {{ o.items.length }} product(s)</p>

        <details style="margin-top:8px">
          <summary>Show items</summary>
          <ul>
            <li v-for="item in o.items" :key="item.id">
              {{ item.title }} — {{ item.price }} ₺
            </li>
          </ul>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.order-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.muted {
  color: #777;
  font-size: 14px;
}
</style>
