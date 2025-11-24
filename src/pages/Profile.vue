<!-- src/pages/Profile.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const error = ref('')

// profile fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const birthDay = ref('')
const birthMonth = ref('')
const birthYear = ref('')
const gender = ref('') // "kadin" | "erkek" | "belirtmek_istemiyorum"
const isEmployee = ref('hayir') // "evet" | "hayir"

let userUid = ''

// options for DOB
const currentYear = new Date().getFullYear()
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const years = Array.from({ length: 80 }, (_, i) => currentYear - i)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push({ name: 'login', query: { redirect: '/profile' } })
      return
    }

    userUid = user.uid
    email.value = user.email || ''

    try {
      const refDoc = doc(db, 'users', userUid)
      const snap = await getDoc(refDoc)
      if (snap.exists()) {
        const data = snap.data()
        firstName.value = data.firstName || data.name || ''
        lastName.value = data.lastName || ''
        phone.value = data.phone || ''
        gender.value = data.gender || ''
        birthDay.value = data.birthDay || ''
        birthMonth.value = data.birthMonth || ''
        birthYear.value = data.birthYear || ''
        isEmployee.value = data.isEmployee || 'hayir'
      }
    } catch (e) {
      console.error(e)
      error.value = 'Bilgiler alınırken hata oluştu.'
    } finally {
      loading.value = false
    }
  })
})

const saveProfile = async () => {
  if (!userUid) return
  saving.value = true
  error.value = ''
  try {
    const refDoc = doc(db, 'users', userUid)
    await updateDoc(refDoc, {
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      gender: gender.value,
      birthDay: birthDay.value,
      birthMonth: birthMonth.value,
      birthYear: birthYear.value,
      isEmployee: isEmployee.value,
    })

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: `${firstName.value} ${lastName.value}`.trim(),
      })
    }

    alert('Bilgiler kaydedildi.')
  } catch (e) {
    console.error(e)
    error.value = 'Kaydedilirken hata oluştu.'
  } finally {
    saving.value = false
  }
}

const deleteAccount = () => {
  alert('Bu projede hesap silme işlemi sadece görsel olarak gösterilmektedir.')
}
</script>

<template>
  <section class="profile-page">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <p class="welcome">HOŞGELDİN,</p>
        <p class="username">{{ firstName || 'Kullanıcı' }}</p>
      </div>

      <nav class="menu">
        <div class="menu-group">
          <button class="menu-item">SİPARİŞLERİM</button>
          <button class="menu-item">ÜRÜN YORUMLARIM</button>
          <button class="menu-item">FAVORİLERİM</button>
          <button class="menu-item">ADRES BİLGİLERİM</button>
          <button class="menu-item">ÖDEME BİLGİLERİM</button>
        </div>

        <div class="menu-group">
          <p class="menu-title">HESAP AYARLARIM</p>
          <button class="menu-item menu-item--active">
            KİŞİSEL BİLGİLERİM
          </button>
          <button class="menu-item">ŞİFRE DEĞİŞTİR</button>
          <button class="menu-item">İLETİŞİM İZİNLERİM</button>
          <button class="menu-item">İLETİŞİM DİLİ TERCİHİ</button>
        </div>

        <div class="menu-group">
          <button class="menu-item">YARDIM</button>
          <button class="menu-item">ÇIKIŞ YAP</button>
        </div>
      </nav>
    </aside>

    <!-- RIGHT CONTENT -->
    <main class="content">
      <header class="content-header">
        <h1>HESABIM</h1>
        <p class="subtitle">KİŞİSEL BİLGİLERİM</p>
      </header>

      <div v-if="loading" class="loading">
        Bilgiler yükleniyor…
      </div>

      <form v-else class="profile-form" @submit.prevent="saveProfile">
        <!-- Name row -->
        <div class="field-row">
          <label class="field half">
            <span class="label">ADINIZ*</span>
            <input v-model="firstName" />
          </label>
          <label class="field half">
            <span class="label">SOYADINIZ*</span>
            <input v-model="lastName" />
          </label>
        </div>

        <!-- Email -->
        <label class="field">
          <span class="label">E-POSTA ADRESİNİZ*</span>
          <input v-model="email" disabled class="disabled" />
        </label>

        <!-- Phone -->
        <label class="field">
          <span class="label">TELEFON*</span>
          <input
            v-model="phone"
            placeholder="0(5xx) xxx xx xx"
          />
        </label>

        <!-- DOB -->
        <div class="dob-group">
          <span class="label">DOĞUM TARİHİNİZ</span>
          <div class="dob-row">
            <select v-model="birthDay">
              <option value="">GÜN</option>
              <option
                v-for="d in days"
                :key="d"
                :value="String(d)"
              >
                {{ d }}
              </option>
            </select>
            <select v-model="birthMonth">
              <option value="">AY</option>
              <option
                v-for="m in months"
                :key="m"
                :value="String(m)"
              >
                {{ m }}
              </option>
            </select>
            <select v-model="birthYear">
              <option value="">YIL</option>
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

        <!-- Gender -->
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

        <!-- Employee -->
        <div class="employee-group">
          <span class="label">DEFACTO ÇALIŞANI MISIN?</span>
          <div class="gender-row">
            <label class="radio">
              <input
                type="radio"
                value="evet"
                v-model="isEmployee"
              />
              <span>EVET</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="hayir"
                v-model="isEmployee"
              />
              <span>HAYIR</span>
            </label>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="error">
          {{ error }}
        </p>

        <!-- Buttons -->
        <div class="buttons">
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? 'Kaydediliyor…' : 'KAYDET' }}
          </button>
          <button type="button" class="delete-btn" @click="deleteAccount">
            HESABIMI SİL
          </button>
        </div>
      </form>
    </main>
  </section>
</template>

<style scoped>
.profile-page {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: calc(100vh - 60px);
  background: #f9fafb;
  color: #111827;
}

/* Sidebar */
.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sidebar-header .welcome {
  font-size: 13px;
  color: #6b7280;
}
.sidebar-header .username {
  font-size: 18px;
  font-weight: 700;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}
.menu-group {
  display: grid;
  gap: 4px;
}
.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.menu-item {
  text-align: left;
  padding: 8px 0;
  border: none;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  color: #111827;
}
.menu-item--active {
  font-weight: 700;
}

/* Content */
.content {
  padding: 32px 40px 40px;
}
.content-header h1 {
  font-size: 22px;
  font-weight: 700;
}
.content-header .subtitle {
  margin-top: 4px;
  font-size: 14px;
  color: #6b7280;
}

/* Form */
.profile-form {
  margin-top: 24px;
  display: grid;
  gap: 14px;
  max-width: 640px;
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
  padding: 9px 10px;
  font-size: 14px;
  background: #ffffff;
}
.disabled {
  background: #f3f4f6;
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

/* Gender / employee */
.gender-group,
.employee-group {
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

/* Buttons */
.buttons {
  margin-top: 10px;
  display: flex;
  gap: 16px;
  align-items: center;
}
.save-btn {
  padding: 11px 32px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.save-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.delete-btn {
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
}

/* Misc */
.loading {
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
}
.error {
  margin-top: 6px;
  color: #b91c1c;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 900px) {
  .profile-page {
    grid-template-columns: 1fr;
  }
  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  .content {
    padding: 24px 16px 32px;
  }
}
</style>
