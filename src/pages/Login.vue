<!-- src/pages/Login.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()
const route = useRoute()

const loginMode = ref('email')

// email login
const email = ref('')
const password = ref('')

// phone login 
const phoneNumber = ref('')
const phonePassword = ref('')

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''

  if (loginMode.value === 'phone') {
    error.value =
      'Telefon ile giriş bu projede sadece arayüz (demo). Lütfen e-posta ile giriş yapın.'
    return
  }

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
        <!-- E-POSTA / TELEFON -->
        <div class="login-method">
          <label
            class="radio"
            :class="{ active: loginMode === 'email' }"
          >
            <input
              type="radio"
              value="email"
              v-model="loginMode"
            />
            <span>E-POSTA</span>
          </label>
          <label
            class="radio"
            :class="{ active: loginMode === 'phone' }"
          >
            <input
              type="radio"
              value="phone"
              v-model="loginMode"
            />
            <span>TELEFON</span>
          </label>
        </div>

        <!-- EMAIL MODE -->
        <template v-if="loginMode === 'email'">
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
              placeholder="Şifreniz"
            />
          </label>
        </template>

        <!-- PHONE MODE (UI فقط) -->
        <template v-else>
          <label class="field">
            <span class="label">TELEFON NUMARANIZ</span>
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="+90 5xx xxx xx xx"
            />
          </label>

          <label class="field">
            <span class="label">ŞİFRE</span>
            <input
              v-model="phonePassword"
              type="password"
              placeholder="Şifreniz"
            />
          </label>
        </template>

        <!-- Remember + forgot -->
        <div class="remember-row">
          <label class="checkbox">
            <input type="checkbox" checked />
            <span>Beni hatırla</span>
          </label>
          <button type="button" class="link-btn">
            Şifremi unuttum
          </button>
        </div>

        <!-- Main login button -->
        <button type="submit" :disabled="loading" class="primary-btn">
          {{ loading ? 'Giriş yapılıyor…' : 'GİRİŞ YAP' }}
        </button>

        <!-- Secondary button (KARGO TAKİP) -->
        <button type="button" class="secondary-btn">
          KARGO TAKİP
        </button>

        <!-- Guest / social -->
        <div class="guest-block">
          <button type="button" class="text-link">
            ÜYE OLMADAN DEVAM ET
          </button>

          <p class="social-title">SOSYAL HESAP İLE ÜYE OL</p>
          <div class="social-buttons">
            <button type="button" class="social-btn fb">f</button>
            <button type="button" class="social-btn google">G</button>
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  display: flex;
  min-height: calc(100vh - 60px);
  background: #ffffff;
}

.auth-hero {
  flex: 1.5;
  background-image: url('https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  left: 40px;
  bottom: 80px;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}
.hero-overlay h1 {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 0.08em;
}
.hero-overlay p {
  font-size: 18px;
  letter-spacing: 0.06em;
}

/* RIGHT SIDE – panel */
.auth-panel {
  flex: 1;
  background: #ffffff;
  padding: 40px 56px;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.auth-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-decoration: none;
  color: #6b7280;
  border-bottom: 2px solid transparent;
}
.tab.active,
.tab.router-link-active {
  font-weight: 600;
  color: #111827;
  border-color: #111827;
}

/* Login method radios */
.login-method {
  display: flex;
  gap: 24px;
  font-size: 13px;
  margin-bottom: 18px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
}
.radio input {
  width: 14px;
  height: 14px;
}
.radio.active {
  color: #111827;
}

/* Form fields */
.auth-form {
  display: grid;
  gap: 14px;
}

.field {
  display: block;
}
.label {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  color: #6b7280;
}
.field input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0;
  padding: 10px 10px;
  font-size: 14px;
  background: #f9fafb;
}

/* Remember / forgot */
.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #4b5563;
  margin-top: 4px;
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

/* Buttons */
.primary-btn {
  margin-top: 14px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 0;
  padding: 12px 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}
.primary-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.secondary-btn {
  margin-top: 10px;
  width: 100%;
  padding: 10px 0;
  border-radius: 0;
  border: 1px solid #111827;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  cursor: pointer;
}

/* Guest & social */
.guest-block {
  margin-top: 18px;
  text-align: center;
}

.text-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  color: #111827;
}

.social-title {
  margin-top: 18px;
  font-size: 13px;
  color: #4b5563;
}

.social-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: #ffffff;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
}

/* Error */
.error {
  margin-top: 10px;
  color: #b91c1c;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
  }
  .auth-hero {
    min-height: 260px;
  }
  .auth-panel {
    padding: 24px 16px 40px;
  }
}
</style>
