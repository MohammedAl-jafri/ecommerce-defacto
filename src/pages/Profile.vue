<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '../stores/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

const email = computed(() => user.value?.email || '')
const name = computed(() => user.value?.displayName || 'Misafir')

const handleLogout = async () => {
  await logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <section class="profile-wrapper">
    <h2>Profil</h2>

    <div v-if="!email" class="muted">
      Giriş yapmamışsınız. Lütfen önce giriş yapın.
    </div>

    <div v-else class="card">
      <p><strong>İsim:</strong> {{ name }}</p>
      <p><strong>E-posta:</strong> {{ email }}</p>

      <button class="danger" @click="handleLogout">Çıkış Yap</button>

      <p class="muted" style="margin-top:8px;">
        İleride: Sipariş geçmişi bu sayfada listelenecek.
      </p>
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
</style>
