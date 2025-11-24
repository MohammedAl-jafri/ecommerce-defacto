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
    <h1 class="title">Admin • Sipariş Yönetimi</h1>
    <p class="muted">Tüm siparişler (yeniden eskiye)</p>

    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="loading" class="loading">Yükleniyor…</div>

    <div v-else class="orders-list">
      <div v-for="o in orders" :key="o.id" class="order-card">
        <!-- HEADER -->
        <header class="order-header">
          <div>
            <strong>Sipariş #{{ o.id }}</strong>
            <div class="date">
              {{
                o.createdAt?.toDate
                  ? o.createdAt.toDate().toLocaleString("tr-TR")
                  : "Tarih yok"
              }}
            </div>
          </div>

          <!-- STATUS BADGE -->
          <span
            class="status"
            :class="o.status || 'pending'"
          >
            {{ o.status || "pending" }}
          </span>
        </header>

        <!-- USER & ORDER INFO -->
        <div class="info-grid">
          <div>
            <p><strong>Kullanıcı:</strong> {{ o.userEmail }}</p>
            <p><strong>Adres:</strong> {{ o.address || "—" }}</p>
            <p><strong>Not:</strong> {{ o.note || "—" }}</p>
          </div>

          <div>
            <p><strong>Toplam:</strong> {{ o.total }} ₺</p>
            <p><strong>Ürün Sayısı:</strong> {{ o.items?.length || 0 }}</p>
          </div>
        </div>

        <!-- PRODUCTS -->
        <details class="details">
          <summary>Ürünleri Göster</summary>
          <ul class="items-list">
            <li v-for="item in o.items" :key="item.id" class="item-row">
              <img
                :src="item.image"
                class="thumb"
                alt=""
              />
              <div>
                <strong>{{ item.title }}</strong>
                <p class="muted2">
                  x{{ item.quantity || 1 }} — {{ item.price }} ₺
                </p>
              </div>
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
}

.title {
  font-size: 27px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.muted {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
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

/* Card */
.order-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 18px 16px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
}

/* Header */
.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.date {
  color: #6b7280;
  font-size: 13px;
}

/* Status badge */
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  height: fit-content;
}

/* colors */
.status.pending {
  background: #fff7ed;
  color: #d97706;
}
.status.paid {
  background: #ecfdf5;
  color: #059669;
}
.status.shipped {
  background: #eff6ff;
  color: #2563eb;
}
.status.cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

/* info grid */
.info-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.info-grid p {
  margin: 2px 0;
  font-size: 14px;
}

/* product list */
.details summary {
  cursor: pointer;
  color: #111827;
  font-weight: 600;
  margin-bottom: 8px;
}

.items-list {
  display: grid;
  gap: 10px;
  padding-left: 0;
}

.item-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.muted2 {
  color: #6b7280;
  font-size: 13px;
}
</style>
