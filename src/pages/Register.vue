<!-- src/pages/Register.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const router = useRouter()
const route = useRoute()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const birthDay = ref('')
const birthMonth = ref('')
const birthYear = ref('')
const gender = ref('') // "kadin" | "erkek" | "belirtmek_istemiyorum"

const loading = ref(false)
const error = ref('')

// options for date of birth
const currentYear = new Date().getFullYear()
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const years = Array.from({ length: 80 }, (_, i) => currentYear - i)

const handleRegister = async () => {
  error.value = ''

  if (!firstName.value || !email.value || !password.value) {
    error.value = 'Ad, e-posta ve şifre zorunludur.'
    return
  }

  loading.value = true
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    // Firebase displayName
    await updateProfile(cred.user, {
      displayName: `${firstName.value} ${lastName.value}`.trim(),
    })

    // Firestore user document
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value || '',
      gender: gender.value || '',
      birthDay: birthDay.value || '',
      birthMonth: birthMonth.value || '',
      birthYear: birthYear.value || '',
      createdAt: new Date(),
    })

    const redirectPath = route.query.redirect || '/profile'
    await router.push(redirectPath)
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Kayıt sırasında bir hata oluştu.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <!-- LEFT HERO (نفس الصورة والنص الذي اتفقنا عليه) -->
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
        <!-- AD / SOYAD -->
        <div class="field-row">
          <label class="field half">
            <span class="label">AD*</span>
            <input
              v-model="firstName"
              placeholder="Adınız"
              required
            />
          </label>

          <label class="field half">
            <span class="label">SOYAD*</span>
            <input
              v-model="lastName"
              placeholder="Soyadınız"
            />
          </label>
        </div>

        <!-- E-POSTA -->
        <label class="field">
          <span class="label">E-POSTA*</span>
          <input
            v-model="email"
            type="email"
            placeholder="ornek@mail.com"
            required
          />
        </label>

        <!-- CEP TELEFONU -->
        <label class="field">
          <span class="label">CEP TELEFONU NUMARASI*</span>
          <input
            v-model="phone"
            type="tel"
            placeholder="+90 5xx xxx xx xx"
          />
        </label>

        <!-- ŞİFRE -->
        <label class="field">
          <span class="label">ŞİFRE*</span>
          <input
            v-model="password"
            type="password"
            placeholder="8-15 karakter, en az bir harf ve rakam"
            required
          />
        </label>

        <!-- DOĞUM TARİHİNİZ -->
        <div class="dob-group">
          <span class="label">DOĞUM TARİHİNİZ</span>
          <div class="dob-row">
            <select v-model="birthDay">
              <option value="" disabled>GÜN</option>
              <option
                v-for="d in days"
                :key="d"
                :value="String(d)"
              >
                {{ d }}
              </option>
            </select>

            <select v-model="birthMonth">
              <option value="" disabled>AY</option>
              <option
                v-for="m in months"
                :key="m"
                :value="String(m)"
              >
                {{ m }}
              </option>
            </select>

            <select v-model="birthYear">
              <option value="" disabled>YIL</option>
              <option
                v-for="y in years"
                :key="y"
                :value="String(y)"
              >
                {{ y }}
              </option>
            </select>
          </div>
        </div>

        <!-- CİNSİYET -->
        <div class="gender-group">
          <span class="label">CİNSİYETİNİZ</span>
          <div class="gender-row">
            <label class="radio">
              <input
                type="radio"
                value="kadin"
                v-model="gender"
              />
              <span>KADIN</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="erkek"
                v-model="gender"
              />
              <span>ERKEK</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="belirtmek_istemiyorum"
                v-model="gender"
              />
              <span>BELİRTMEK İSTEMİYORUM</span>
            </label>
          </div>
        </div>

        <!-- (اختياري) نصوص الموافقة مثل الموقع الحقيقي – فقط واجهة -->
        <div class="agreements">
          <p class="agreement-text">
            Lütfen üye olmadan önce <span class="link-like">Üye Aydınlatma Metni</span>'ni okuyunuz.
          </p>
          <label class="checkbox">
            <input type="checkbox" />
            <span>
              Kişisel verilerimin reklam, promosyon, tanıtım vb. ticari elektronik
              ileti gönderilmesi üzere işlenmesini, bu amaçla kullanılmasını
              ve saklanmasını kabul ediyorum.
            </span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>
              Kişisel verilerimin kişiselleştirilmiş pazarlama amacıyla
              işlenmesine ilişkin <span class="link-like">Açık Rıza Metni</span>'ni okudum,
              kabul ediyorum.
            </span>
          </label>
        </div>

        <!-- زر التسجيل -->
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
  background: #ffffff;
}

/* LEFT HERO */
.auth-hero {
  flex: 1.5;
  background-image: url('https://images.pexels.com/photos/1353503/pexels-photo-1353503.jpeg');
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
  letter-spacing: 0.04em;
}

/* RIGHT PANEL */
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

/* Form */
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
.field {
  display: block;
}
.label {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  color: #6b7280;
}
.field input,
.dob-row select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0;
  padding: 10px;
  font-size: 14px;
  background: #f9fafb;
}

/* DOB */
.dob-group {
  margin-top: 4px;
}
.dob-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

/* Gender */
.gender-group {
  margin-top: 4px;
}
.gender-row {
  display: flex;
  gap: 18px;
  margin-top: 6px;
  font-size: 13px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.radio input {
  width: 14px;
  height: 14px;
}

/* Agreements */
.agreements {
  margin-top: 10px;
  font-size: 12px;
  color: #4b5563;
  display: grid;
  gap: 6px;
}
.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.checkbox input {
  margin-top: 3px;
}
.link-like {
  text-decoration: underline;
  cursor: pointer;
}

/* Button */
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
