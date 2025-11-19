<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const router = useRouter()
const route = useRoute()

const displayName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'E-posta ve şifre zorunlu.'
    return
  }

  loading.value = true

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    if (displayName.value) {
      await updateProfile(cred.user, {
        displayName: displayName.value
      })
    }

    const redirectPath = route.query.redirect || '/profile'
    await router.push(redirectPath)
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <!-- LEFT HERO -->
    <div class="auth-hero">
      <div class="hero-overlay">
        <h1>HEMEN ÜYE OL</h1>
        <p>GIFT CLUB'IN AVANTAJLARLA DOLU DÜNYASINA SEN DE KATIL!</p>
      </div>
    </div>

    <!-- RIGHT FORM PANEL -->
    <div class="auth-panel">
      <!-- Tabs -->
      <div class="auth-tabs">
        <RouterLink to="/login" class="tab">
          GİRİŞ YAP
        </RouterLink>
        <RouterLink to="/register" class="tab" :class="{ active: true }">
          ÜYE OL
        </RouterLink>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="field-row">
          <label class="field half">
            <span class="label">AD</span>
            <input
              v-model="displayName"
              placeholder="Adınız"
            />
          </label>

          <label class="field half">
            <span class="label">SOYAD</span>
            <input placeholder="Soyadınız" />
          </label>
        </div>

        <label class="field">
          <span class="label">E-POSTA</span>
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
            placeholder="8-15 karakter, en az bir harf ve rakam"
          />
        </label>

        <!-- You can add more fields if professor wants (phone, birth date, etc.) -->

        <button type="submit" :disabled="loading" class="primary-btn">
          {{ loading ? 'Kaydediliyor…' : 'ÜYE OL' }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  display: flex;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
}

.auth-hero {
  flex: 1.4;
  background-image: url('https://images.pexels.com/photos/1353503/pexels-photo-1353503.jpeg');
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

/* Right */
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

.field-row {
  display: flex;
  gap: 12px;
}
.half {
  flex: 1;
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
