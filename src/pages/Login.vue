<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'E-posta ve şifre zorunlu.'
    return
  }

  loading.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)

    // 🔁 If there is a redirect (from guard), go there, else go to profile
    const redirectPath = route.query.redirect || '/profile'
    await router.push(redirectPath)
  } catch (err) {
    console.error(err)
    error.value = 'Giriş başarısız: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <section class="auth-wrapper">
    <h2>Giriş</h2>
    <p class="muted">Firebase Auth ile e-posta/şifre girişi.</p>

    <form class="card" @submit.prevent="handleLogin">
      <label>
        E-posta
        <input
          v-model="email"
          type="email"
          class="btn"
          placeholder="ornek@mail.com"
        />
      </label>

      <label>
        Şifre
        <input
          v-model="password"
          type="password"
          class="btn"
          placeholder="••••••••"
        />
      </label>

      <button type="submit" :disabled="loading" class="primary">
        {{ loading ? 'Giriş yapılıyor…' : 'Giriş Yap' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>

<style scoped>
.auth-wrapper {
  max-width: 400px;
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
  gap: 12px;
}
.btn {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 6px 8px;
}
.primary {
  background: #ff8400;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}
.error {
  color: #b91c1c;
  font-size: 13px;
}
.muted {
  color: #94a3b8;
  font-size: 14px;
}
</style>
