<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const orders = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(qOrders);

    orders.value = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Orders could not be loaded:", err);
    error.value = "Orders could not be loaded.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="admin-orders">
    <h1>Admin • Siparişler</h1>
    <p class="muted">Tüm siparişler (yeniden eskiye)</p>

    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="loading" class="loading">Yükleniyor…</div>

    <div v-else class="orders-list">
      <div v-for="o in orders" :key="o.id" class="order-card">
        <header class="order-header">
          <strong>Sipariş #{{ o.id }}</strong>
          <span class="date">
            {{
              o.createdAt?.toDate
                ? o.createdAt.toDate().toLocaleString("tr-TR")
                : "Tarih yok"
            }}
          </span>
        </header>

        <div class="order-info">
          <p><strong>Kullanıcı:</strong> {{ o.userEmail }}</p>
          <p><strong>Toplam Tutar:</strong> {{ o.total }} ₺</p>
          <p><strong>Ürün Sayısı:</strong> {{ o.items?.length || 0 }}</p>
          <p v-if="o.address">
            <strong>Adres:</strong> {{ o.address }}
          </p>
          <p v-if="o.note">
            <strong>Not:</strong> {{ o.note }}
          </p>
        </div>

        <details class="details">
          <summary>Ürünleri Göster</summary>
          <ul class="items-list">
            <li v-for="item in o.items" :key="item.id">
              {{ item.title }}
              (x{{ item.quantity || 1 }}) — {{ item.price }} ₺
            </li>
          </ul>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-orders {
  max-width: 900px;
  margin: 0 auto;
  padding: 26px 14px;
  background: #fafafa;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.muted {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 18px;
}

.loading {
  color: #6b7280;
  font-size: 15px;
}

.error {
  color: #b91c1c;
  background: #fee2e2;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.orders-list {
  display: grid;
  gap: 16px;
}

/* Main card */
.order-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 18px 16px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
}

/* Header */
.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.date {
  color: #6b7280;
  font-size: 13px;
}

/* Info section */
.order-info p {
  margin: 2px 0;
  font-size: 14px;
}

/* Details dropdown */
.details summary {
  margin-top: 10px;
  cursor: pointer;
  color: #111827;
  font-weight: 600;
}

.items-list {
  margin-top: 8px;
  padding-left: 16px;
  display: grid;
  gap: 4px;
  font-size: 14px;
}
</style>
