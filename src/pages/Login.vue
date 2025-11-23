<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
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
  <section class="auth-page">
    <!-- LEFT: HERO IMAGE / TEXT -->
    <div class="auth-hero">
      <div class="hero-overlay">
        <h1>HEMEN GİRİŞ YAP</h1>
        <p>DeFacto İLE TRENDLERİN MODA DÜNYASI</p>
      </div>
    </div>

    <!-- RIGHT: FORM PANEL -->
    <div class="auth-panel">
      <!-- Tabs (Giriş / Üye Ol) -->
      <div class="auth-tabs">
        <RouterLink
          to="/login"
          class="tab"
          :class="{ active: true }"
        >
          GİRİŞ YAP
        </RouterLink>
        <RouterLink
          to="/register"
          class="tab"
        >
          ÜYE OL
        </RouterLink>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label class="field">
          <span class="label">E-POSTA ADRESİNİZ</span>
          <input
            v-model="email"
            type="email"
            placeholder="ornek@mail.com"
          />
        </label>

        <label class="field">
          <span class="label">ŞİFRE</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
          />
        </label>

        <div class="remember-row">
          <label class="checkbox">
            <input type="checkbox" checked />
            <span>Beni hatırla</span>
          </label>
          <button type="button" class="link-btn">Şifremi unuttum</button>
        </div>

        <button type="submit" :disabled="loading" class="primary-btn">
          {{ loading ? 'Giriş yapılıyor…' : 'GİRİŞ YAP' }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  display: flex;
  min-height: calc(100vh - 60px); /* below header */
  background: #f5f5f5;
}

/* LEFT SIDE */
.auth-hero {
  flex: 1.4;
  background-image: url('https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  bottom: 80px;
  left: 40px;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}
.hero-overlay h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}
.hero-overlay p {
  font-size: 18px;
}

/* RIGHT SIDE */
.auth-panel {
  flex: 1;
  background: #fff;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  letter-spacing: 0.4px;
  text-decoration: none;
  color: #555;
  border-bottom: 2px solid transparent;
}
.tab.active,
.tab.router-link-active {
  font-weight: 600;
  color: #000;
  border-color: #000;
}

.auth-form {
  display: grid;
  gap: 14px;
}

.field input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 14px;
}
.label {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  color: #6b7280;
}

/* Remember / forgot */
.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #4b5563;
}
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.checkbox input {
  width: 14px;
  height: 14px;
}
.link-btn {
  background: none;
  border: none;
  padding: 0;
  color: #111827;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}

/* Primary button */
.primary-btn {
  margin-top: 8px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}
.primary-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.error {
  margin-top: 8px;
  color: #b91c1c;
  font-size: 13px;
}
</style>
