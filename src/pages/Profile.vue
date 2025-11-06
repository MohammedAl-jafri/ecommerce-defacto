<script setup>
import { ref } from 'vue'

// Part-3'te buraya Firebase Auth'tan gelen kullanıcı bilgisi yerleştirilecek
const user = ref({
  name: 'Demo Kullanıcı',
  email: 'demo@example.com',
})

const orders = ref([
  // Part-3'te Firestore'dan çekilecek
  { id: 'ORD-001', total: 350, status: 'Hazırlanıyor' },
  { id: 'ORD-002', total: 149, status: 'Teslim edildi' },
])
</script>

<template>
  <section style="max-width:720px;margin:0 auto;display:grid;gap:16px">
    <h2>Profil</h2>
    <p class="muted">Kullanıcı bilgileri ve sipariş geçmişi.</p>

    <!-- user card -->
    <div
      style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;display:grid;gap:6px"
    >
      <h3>Hesap Bilgileri</h3>
      <p><strong>Ad:</strong> {{ user.name }}</p>
      <p><strong>E-posta:</strong> {{ user.email }}</p>
      <p class="muted" style="font-size:12px">
        Not: Giriş yaptıktan sonra bu alan Firebase'den gelecektir.
      </p>
    </div>

    <!-- orders -->
    <div
      style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;display:grid;gap:8px"
    >
      <h3>Siparişlerim</h3>
      <div v-if="orders.length">
        <div
          v-for="o in orders"
          :key="o.id"
          style="display:flex;justify-content:space-between;align-items:center"
        >
          <div>
            <strong>{{ o.id }}</strong>
            <div class="muted">{{ o.status }}</div>
          </div>
          <div>{{ o.total }} ₺</div>
        </div>
      </div>
      <p v-else class="muted">Henüz sipariş yok.</p>
    </div>
  </section>
</template>

<style scoped>
.muted {
  color: #94a3b8;
}
</style>
