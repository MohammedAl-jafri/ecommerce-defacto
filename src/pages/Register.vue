<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const router = useRouter()

// Form Fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const showPassword = ref(false)

// Date Fields
const birthDay = ref('')
const birthMonth = ref('')
const birthYear = ref('')
const gender = ref('') 

// Checkboxes
const agree1 = ref(false)
const agree2 = ref(false)
const agree3 = ref(false)

// UI States
const loading = ref(false)
const isPhoneFocused = ref(false)

// Errors State
const errors = ref({})

// Helpers for Date
const startYear = 2008;
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const years = Array.from({ length: 84 }, (_, i) => startYear - i)

// ✅ دالة مسح الخطأ عند الكتابة
const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// ✅ دالة التحقق عند مغادرة الحقل (Blur)
const handleBlur = (field) => {
  // 1. فحص الاسم
  if (field === 'firstName' && !firstName.value) {
    errors.value.firstName = 'Adınızı giriniz'
  }
  
  // 2. فحص اللقب
  if (field === 'lastName' && !lastName.value) {
    errors.value.lastName = 'Soyadınızı giriniz'
  }

  // 3. فحص الإيميل
  if (field === 'email') {
    if (!email.value) {
      errors.value.email = 'Lütfen küçük harf ile geçerli bir E-posta adresi formatında giriniz.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errors.value.email = 'Lütfen küçük harf ile geçerli bir E-posta adresi formatında giriniz.'
    }
  }

  // 4. فحص الهاتف
  if (field === 'phone') {
    if (!phone.value || phone.value.length < 15) {
       errors.value.phone = 'Telefon numaranızı giriniz'
    }
  }

  // 5. فحص كلمة السر (فقط إذا كانت فارغة عند المغادرة)
  if (field === 'password') {
    if (!password.value) {
      errors.value.password = 'Şifre gereklidir'
    }
  }
}

// دالة تنسيق الهاتف
const formatPhone = (event) => {
  clearError('phone')
  
  let val = event.target.value.replace(/\D/g, '')
  if (val.startsWith('0')) val = val.substring(1)
  val = val.substring(0, 10)

  let formatted = ''
  if (val.length > 0) formatted = '0(' + val.substring(0, 3)
  if (val.length > 3) formatted += ') ' + val.substring(3, 6)
  if (val.length > 6) formatted += ' ' + val.substring(6, 8)
  if (val.length > 8) formatted += ' ' + val.substring(8, 10)

  phone.value = formatted
}

// دالة التحقق الكاملة عند الضغط على الزر
const validateForm = () => {
  errors.value = {}
  let isValid = true

  // نستدعي منطق الـ Blur لكل حقل يدوياً للتأكد من كل شيء
  handleBlur('firstName')
  if (errors.value.firstName) isValid = false

  handleBlur('lastName')
  if (errors.value.lastName) isValid = false

  handleBlur('email')
  if (errors.value.email) isValid = false

  handleBlur('phone')
  if (errors.value.phone) isValid = false

  handleBlur('password')
  if (errors.value.password) isValid = false

  // فحص الشروط الإضافية (Checkboxes)
  if (!agree2.value) {
    errors.value.agree2 = 'Açık Rıza Metni boş bırakılamaz'
    isValid = false
  }

  if (!agree3.value) {
    errors.value.agree3 = 'Üyelik sözleşmesi boş bırakılamaz'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await updateProfile(cred.user, {
      displayName: `${firstName.value} ${lastName.value}`.trim(),
    })

    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      gender: gender.value,
      birthDate: `${birthDay.value}/${birthMonth.value}/${birthYear.value}`,
      createdAt: new Date(),
    })

    await router.push('/profile')
  } catch (err) {
    console.error(err)
    errors.value.general = err.message || 'Kayıt sırasında hata oluştu.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-hero">
      <div class="hero-overlay">
        <h1>HEMEN ÜYE OL</h1>
        <p>GIFT CLUB'IN AVANTAJLARLA DOLU DÜNYASINA SEN DE KATIL!</p>
      </div>
    </div>

    <div class="auth-panel">
    <div class="auth-tabs">
           <RouterLink to="/login" class="tab">
                    GİRİŞ YAP
           </RouterLink>
           <RouterLink to="/register" class="tab active">
                    ÜYE OL
           </RouterLink>
           </div>


      <form class="auth-form" @submit.prevent="handleRegister" novalidate>
        
        <div class="form-row">
          <div class="form-group floating-label-group half-width">
            <input 
              v-model="firstName" 
              type="text" 
              class="custom-input" 
              :class="{ 'has-error': errors.firstName }"
              placeholder=" " 
              @input="clearError('firstName')"
              @blur="handleBlur('firstName')"
            />
            <label class="floating-label">AD*</label>
            <div v-if="errors.firstName" class="input-error-msg">
                <svg width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path></svg>
                {{ errors.firstName }}
            </div>
          </div>

          <div class="form-group floating-label-group half-width">
            <input 
              v-model="lastName" 
              type="text" 
              class="custom-input" 
              :class="{ 'has-error': errors.lastName }"
              placeholder=" " 
              @input="clearError('lastName')"
              @blur="handleBlur('lastName')"
            />
            <label class="floating-label">SOYAD*</label>
             <div v-if="errors.lastName" class="input-error-msg">
                <svg width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path></svg>
                {{ errors.lastName }}
            </div>
          </div>
        </div>

        <div class="form-group floating-label-group">
          <input 
            v-model="email" 
            type="email" 
            class="custom-input" 
            :class="{ 'has-error': errors.email }"
            placeholder=" " 
            @input="clearError('email')"
            @blur="handleBlur('email')"
          />
          <label class="floating-label">E-POSTA*</label>
            <div v-if="errors.email" class="input-error-msg">
                <svg width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path></svg>
                {{ errors.email }}
            </div>
        </div>

        <div class="form-group floating-label-group">
          <input 
            v-model="phone" 
            type="tel" 
            class="custom-input phone-input" 
            :class="{ 'has-error': errors.phone }"
            :placeholder="isPhoneFocused && !phone ? '0(___) ___ __ __' : ' '" 
            @focus="isPhoneFocused = true"
            @blur="() => { isPhoneFocused = false; handleBlur('phone') }" 
            @input="formatPhone"
            maxlength="17"
            autocomplete="off" 
          />
          <label class="floating-label">CEP TELEFONU NUMARASI*</label>
            <div v-if="errors.phone" class="input-error-msg">
                <svg width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path></svg>
                {{ errors.phone }}
            </div>
        </div>

        <div class="form-group password-group">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="custom-input"
              placeholder=" "
            />
            <label class="floating-label">ŞİFRE*</label>

            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="24" height="12" viewBox="0 0 24 12"><path fill="#22242A" fill-rule="evenodd" d="M12 3c-1.645 0-2.978 1.343-2.978 3S10.355 9 12 9s2.978-1.343 2.978-3S13.645 3 12 3M9.767 6c0-1.243 1-2.25 2.233-2.25A2.24 2.24 0 0 1 14.233 6c0 1.243-1 2.25-2.233 2.25A2.24 2.24 0 0 1 9.767 6" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="M12 0C8.18 0 5.222 1.444 3.223 2.882c-1 .72-1.761 1.439-2.274 1.98a13 13 0 0 0-.733.845l-.04.05-.01.015-.003.004-.001.001.3.223-.3-.222L0 6l.161.222.3-.222-.3.222h.001v.002l.004.004.01.014.04.051q.051.068.15.188c.131.16.326.386.583.657.513.541 1.274 1.26 2.274 1.98C5.222 10.556 8.18 12 12 12c3.82 0 6.778-1.444 8.777-2.882 1-.72 1.761-1.439 2.274-1.98a13 13 0 0 0 .733-.845l.04-.05.01-.015.004-.005-.3-.223.3.222L24 6l-.161-.222-.3.222.3-.222h-.001l-.004-.006-.01-.014-.04-.051-.15-.188c-.131-.16-.326-.386-.582-.657a16 16 0 0 0-2.275-1.98C18.778 1.444 15.82 0 12 0M1.487 6.62a12 12 0 0 1-.548-.618L.937 6l.002-.002c.121-.148.304-.361.548-.618.487-.514 1.214-1.2 2.169-1.887C5.565 2.119 8.376.75 12 .75c3.625 0 6.435 1.369 8.344 2.743a15.5 15.5 0 0 1 2.17 1.887c.243.257.426.47.547.618l.002.002-.002.002c-.121.148-.304.361-.548.618-.487.514-1.214 1.2-2.169 1.887-1.909 1.374-4.72 2.743-8.344 2.743-3.625 0-6.435-1.369-8.344-2.743a15.5 15.5 0 0 1-2.17-1.887" clip-rule="evenodd"></path></svg>
                
                <svg v-else width="24" height="18" viewBox="0 0 24 18"><path fill="currentColor" fill-rule="evenodd" d="M17.445 3.906 20.56.79a.372.372 0 0 0-.527-.527l-3.36 3.361A14.7 14.7 0 0 0 12 2.87c-3.82 0-6.778 1.433-8.777 2.86-1 .714-1.761 1.428-2.274 1.965a13 13 0 0 0-.733.839l-.04.05-.01.015-.003.004-.001.001.3.221-.3-.22-.162.22.161.22.3-.22-.3.22.002.002.003.004.01.014a5 5 0 0 0 .19.237c.131.16.326.384.583.652a16 16 0 0 0 2.274 1.965 15.7 15.7 0 0 0 3.333 1.824l-3.117 3.116a.372.372 0 1 0 .527.527l3.36-3.362c1.374.46 2.935.756 4.674.756 3.82 0 6.778-1.433 8.777-2.86 1-.715 1.761-1.429 2.274-1.966a13 13 0 0 0 .733-.838l.04-.05.01-.015.004-.005-.3-.221.3.22.162-.22-.161-.22-.3.22.3-.22-.005-.006-.01-.014-.04-.051-.15-.186a13 13 0 0 0-.582-.653 16 16 0 0 0-2.275-1.964 15.7 15.7 0 0 0-3.332-1.824m-1.364.31A14 14 0 0 0 12 3.614c-3.625 0-6.435 1.359-8.344 2.722a15.4 15.4 0 0 0-2.17 1.874c-.243.255-.426.466-.547.613l-.002.002.002.002c.121.147.304.358.548.613.487.51 1.214 1.192 2.169 1.874a15 15 0 0 0 3.476 1.853l2.516-2.516a2.978 2.978 0 0 1 4.178-4.178zm-1.729 2.782 2.516-2.516a15 15 0 0 1 3.476 1.853 15.4 15.4 0 0 1 2.17 1.874c.243.255.426.466.547.613l.002.002-.002.002c-.121.147-.304.358-.548.613a15.4 15.4 0 0 1-2.169 1.874c-1.909 1.363-4.72 2.722-8.344 2.722-1.502 0-2.865-.233-4.08-.604l2.254-2.255a2.978 2.978 0 0 0 4.178-4.178m-1.058.006a2.233 2.233 0 0 0-3.114 3.114zm-2.588 3.64L13.82 7.53a2.233 2.233 0 0 1-3.114 3.114" clip-rule="evenodd"></path></svg>
            </button>
          </div>

        <div class="password-rules" :class="{ 'has-error': errors.password }">
          <div class="rule-item"><span class="check-circle"><svg width="8" height="8" viewBox="0 0 16 14"><path fill="currentColor" d="m1.479 6.894 3.676 4.264L14.521.294a.78.78 0 0 1 1.226 0 1.12 1.12 0 0 1 0 1.422L5.156 14 .254 8.316a1.12 1.12 0 0 1 0-1.422.78.78 0 0 1 1.226 0z"></path></svg></span> En az bir büyük harf</div>
          <div class="rule-item"><span class="check-circle"><svg width="8" height="8" viewBox="0 0 16 14"><path fill="currentColor" d="m1.479 6.894 3.676 4.264L14.521.294a.78.78 0 0 1 1.226 0 1.12 1.12 0 0 1 0 1.422L5.156 14 .254 8.316a1.12 1.12 0 0 1 0-1.422.78.78 0 0 1 1.226 0z"></path></svg></span> En az bir küçük harf</div>
          <div class="rule-item"><span class="check-circle"><svg width="8" height="8" viewBox="0 0 16 14"><path fill="currentColor" d="m1.479 6.894 3.676 4.264L14.521.294a.78.78 0 0 1 1.226 0 1.12 1.12 0 0 1 0 1.422L5.156 14 .254 8.316a1.12 1.12 0 0 1 0-1.422.78.78 0 0 1 1.226 0z"></path></svg></span> En az bir rakam</div>
          <div class="rule-item"><span class="check-circle"><svg width="8" height="8" viewBox="0 0 16 14"><path fill="currentColor" d="m1.479 6.894 3.676 4.264L14.521.294a.78.78 0 0 1 1.226 0 1.12 1.12 0 0 1 0 1.422L5.156 14 .254 8.316a1.12 1.12 0 0 1 0-1.422.78.78 0 0 1 1.226 0z"></path></svg></span> 8-15 arası karakter</div>
        </div>

        <div class="form-row date-row">
            <div class="form-group third-width">
                <label class="static-label">GÜN</label>
                <select v-model="birthDay" class="custom-select">
                    <option value="" disabled selected>SEÇİNİZ</option>
                    <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
                </select>
            </div>
            <div class="form-group third-width">
                <label class="static-label">AY</label>
                <select v-model="birthMonth" class="custom-select">
                    <option value="" disabled selected>SEÇİNİZ</option>
                    <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                </select>
            </div>
            <div class="form-group third-width">
                <label class="static-label">YIL</label>
                <select v-model="birthYear" class="custom-select">
                    <option value="" disabled selected>SEÇİNİZ</option>
                    <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
            </div>
        </div>

        <div class="gender-group">
            <label class="radio">
                <input type="radio" value="kadin" v-model="gender" />
                <span class="radio-mark"></span>
                <span class="radio-text">KADIN</span>
            </label>
            <label class="radio">
                <input type="radio" value="erkek" v-model="gender" />
                <span class="radio-mark"></span>
                <span class="radio-text">ERKEK</span>
            </label>
            <label class="radio">
                <input type="radio" value="belirtmek_istemiyorum" v-model="gender" />
                <span class="radio-mark"></span>
                <span class="radio-text">BELİRTMEK İSTEMİYORUM</span>
            </label>
        </div>

        <p class="info-text">Lütfen üye olmadan önce <a href="#">Üye Aydınlatma Metni</a>'ni okuyunuz.</p>

        <div class="agreements">
            <label class="checkbox">
                <input type="checkbox" v-model="agree1" />
                <span class="checkbox-box"></span>
                <span class="checkbox-label">
                    Kişisel verilerimin reklam, promosyon, tanıtım vb. ticari elektronik ileti gönderilmek üzere işlenmesini, bu amaçla kullanılmasını, saklanmasını ve tarafıma ticari elektronik ileti gönderilmesini, <b>açıklanan kurallar çerçevesinde</b> kabul ediyorum.
                </span>
            </label>

            <label class="checkbox">
                <input type="checkbox" v-model="agree2" @change="clearError('agree2')" />
                <span class="checkbox-box"></span>
                <span class="checkbox-label">
                    Kişisel verilerimin kişiselleştirilmiş pazarlama, profilime/segmentasyon amacıyla işlenmesine ilişkin <a href="#">Açık Rıza Metni</a>'ni okudum, Kabul ediyorum
                </span>
            </label>
             <div v-if="errors.agree2" class="input-error-msg" style="margin-top:0;">
                <svg width="14" height="14" viewBox="0 0 20 20"><path fill="currentColor" d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path></svg>
                {{ errors.agree2 }}
            </div>

            <label class="checkbox">
                <input type="checkbox" v-model="agree3" @change="clearError('agree3')" />
                <span class="checkbox-box"></span>
                <span class="checkbox-label">
                    <b>DeFacto Gift Club Üyelik Sözleşmesi</b>'ni okudum, kabul ediyorum
                </span>
            </label>
            <div v-if="errors.agree3" class="input-error-msg" style="margin-top:0;">
                <svg width="14" height="14" viewBox="0 0 20 20"><path fill="currentColor" d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path></svg>
                {{ errors.agree3 }}
            </div>
        </div>

        <button type="submit" :disabled="loading" class="primary-btn">
          {{ loading ? 'Kaydediliyor…' : 'ÜYE OL' }}
        </button>

        <p class="social-title">SOSYAL HESAP İLE ÜYE OL</p>
        <div class="social-buttons">
          <button type="button" class="social-btn">
               <svg width="21" height="21" viewBox="0 0 21 21" fill="none"><path d="M11.8124 10.9704C11.8124 10.2469 11.7424 9.5 11.6257 8.7998H1.51953V12.931H7.3078C7.07441 14.2613 6.30419 15.4283 5.16054 16.1752L8.61484 18.8593C10.6454 16.9687 11.8124 14.2146 11.8124 10.9704Z" fill="#4280EF"/><g clip-path="url(#clip0_3056_116949)"><path d="M21 10.5C21 4.70101 16.299 0 10.5 0C4.70101 0 0 4.70101 0 10.5C0 15.7408 3.83968 20.0847 8.85938 20.8724V13.5352H6.19336V10.5H8.85938V8.18672C8.85938 5.55516 10.427 4.10156 12.8254 4.10156C13.9742 4.10156 15.1758 4.30664 15.1758 4.30664V6.89062H13.8518C12.5475 6.89062 12.1406 7.70007 12.1406 8.53043V10.5H15.0527L14.5872 13.5352H12.1406V20.8724C17.1603 20.0847 21 15.741 21 10.5Z" fill="#1877F2"/><path d="M14.5872 13.5352L15.0527 10.5H12.1406V8.53043C12.1406 7.70007 12.5475 6.89062 13.8518 6.89062H15.1758V4.30664C15.1758 4.30664 13.9742 4.10156 12.8254 4.10156C10.427 4.10156 8.85938 5.55516 8.85938 8.18672V10.5H6.19336V13.5352H8.85938V20.8724C9.39401 20.9563 9.94178 21 10.5 21C11.0582 21 11.606 20.9563 12.1406 20.8724V13.5352H14.5872Z" fill="white"/></g><defs><clipPath id="clip0_3056_116949"><rect width="21" height="21" fill="white"/></clipPath></defs></svg>
          </button>
        </div>
        
        <p v-if="errors.general" class="error">{{ errors.general }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
* {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.auth-page {
  display: flex;
  min-height: calc(100vh - 60px);
  background: #ffffff;
}

/* HERO SECTION */
.auth-hero {
  flex: 1.5;
  background-image: url('https://images.pexels.com/photos/1353503/pexels-photo-1353503.jpeg');
  background-size: cover;
  background-position: top center;
  position: relative;
}
.hero-overlay {
  position: absolute;
  left: 60px;
  bottom: 80px;
  color: #ffffff;
}
.hero-overlay h1 {
  font-size: 60px;
  font-weight: 300;
  margin: 0 0 10px 0;
  line-height: 1;
  letter-spacing: 0.02em;
}
.hero-overlay p {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 0.05em;
  margin: 0;
}

/* PANEL SECTION */
.auth-panel {
  flex: 1;
  max-width: 600px;
  background: #ffffff;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
}

/* TABS */
.auth-tabs {
  display: flex;
  border-bottom: 1px solid #e9e8ea;
  margin-bottom: 24px;
  position: relative;
}
.tab {
  flex: 1;
  text-align: center;
  margin-right: 0px;
  padding: 6px 0;
  font-size: 18px;
  text-decoration: none;
  color: #22242a; 
  font-weight: 400;
  position: relative; 
  transition: color 0.3s ease; 
}
/* العنصر الزائف الذي سيشكل الخط الأسود */
.tab::after {
  content: '';
  position: absolute;
  bottom: -1px; 
  left: 0;
  width: 0%; 
  height: 1px; 
  background-color: #22242a;
  transition: width 0.3s ease; text-shadow: #767272; 
}
.tab:hover {
  color: #585562;
  font-weight: 700;
}
.tab:hover::after {
  width: 100%;
}
.tab.active,
.tab.router-link-active {
  color: #000000;
  font-weight: 700;
}
.tab.active::after,
.tab.router-link-active::after {
  width: 100%;
}

.tab.active:hover,
.tab.router-link-active:hover {
  color: #585562; 
}

/* FORM STYLES */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px; 
}

/* Layout Helpers */
.form-row {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}
.half-width {
  width: 48%;
}
.third-width {
    width: 32%;
}

/* Form Group */
.form-group {
  position: relative;
  width: 100%;
}

/* Custom Input */
.custom-input, .custom-select {
  width: 100%;
  height: 70px;
  border: none;
  border-bottom: 1px solid #000000;
  border-radius: 0;
  font-size: 18px;
  color: #22242a;
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
  padding-top: 15px;
}
.custom-input:focus, .custom-select:focus {
  border-bottom-color: #22242a;
}

/* Error State Styling */
.custom-input.has-error {
    border-bottom-color: #ff3b3b !important;
}

/* Input Error Message */
.input-error-msg {
    color: #ff3b3b;
    font-size: 10px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 400;
}

.custom-input::placeholder {
  color: transparent;
}
.custom-input::-ms-reveal,
.custom-input::-ms-clear {
  display: none !important;
}

/* Placeholder for Phone focus */
.phone-input:focus::placeholder {
  color: #000000;
  font-weight: 400;
  opacity: 1;
  font-size: 18px;
  letter-spacing: 2px;
}

/* Floating Label */
.floating-label {
  position: absolute;
  left: 0;
  top: 38px;
  font-size: 18px;
  color: #22242a;
  pointer-events: none;
  transition: 0.2s ease all;
  text-transform: uppercase;
  font-weight: 400;
}
.custom-input:focus ~ .floating-label,
.custom-input:not(:placeholder-shown) ~ .floating-label {
  top: -8px;
  font-size: 14px;
  font-weight: 500;
  color: #908e97;
}

/* Static Label for Selects */
.static-label {
    font-size: 14px;
    color: #908e97;
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
}
.custom-select {
    padding-top: 3px;
    padding-bottom: 5px;
    cursor: pointer;
}

/* PASSWORD EYE ICON */
.eye-btn {
  position: absolute;
  right: 0;
  top: 0; 
  height: 150%; 
  background: none;
  border: none;
  padding: 0 10px; 
  cursor: pointer;
  color: #000000;
  display: flex; 
  align-items: center; 
  justify-content: center;
  z-index: 10;
  outline: none;
}

.eye-btn svg {
  width: 20px;       
  height: auto;      
  display: block;
}

/* Password Rules */
.password-rules {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-top: -8px;
    margin-bottom: 15px;
}
.rule-item {
    font-size: 13px;
    font-weight: 500;
    color: #C7C6CB;
    display: flex;
    align-items: center;
    gap: 4px;
}
/* Error styling for password rules */
.password-rules.has-error .rule-item {
    color: #ff3b3b;
}
.password-rules.has-error .check-circle {
    background-color: #ff3b3b;
}

.check-circle {
    width: 20px;
    height: 20px;
    background-color: #C7C6CB;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.check-circle svg {
    width: 19px;
    height: 10px;
}

/* Gender Group */
.gender-group {
    display: flex;
    gap: 20px;
    margin-top: 18px;
    margin-bottom: 10px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #22242a;
}
.radio input {
  display: none;
}
.radio-mark {
  width: 14px;
  height: 14px;
  border: 1px solid #c7c6cb;
  border-radius: 50%;
  position: relative;
}
.radio input:checked + .radio-mark {
    border-color: #22242a;
}
.radio input:checked + .radio-mark:after {
  content: "";
  width: 9px;
  height: 9px;
  background: #22242a;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.radio-text {
  font-size: 15px;
  font-weight: 400;
}

/* Agreements */
.info-text {
    font-size: 15px;
    color: #393741;
    margin-bottom: 10px;
}
.info-text a, .checkbox-label a {
    color: #000;
    text-decoration: underline;
    font-weight: 700;
}
.agreements {
    display: flex;
    flex-direction: column;
    gap: 17px;
}
.checkbox {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
}
.checkbox input {
    display: none;
}
.checkbox-box {
    width: 14px;
    height: 14px;
    border: 1px solid #c7c6cb;
    flex-shrink: 0;
    position: relative;
    margin-top: 1px;
    transition: border-color 0.3s;
}
.checkbox input:checked + .checkbox-box {
    background-color: #22242a;
    border-color: #22242a;
}
.checkbox input:checked + .checkbox-box::after {
  content: '';
  position: absolute;
  width: 10px; 
  height: 9px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 18'%3E%3Cpath d='M7 11.25l-4-4.5-3 3.376L7 18 20 3.374 17 0z' fill='%23ffffff'/%3E%3C/svg%3E");
  
  background-repeat: no-repeat;
  background-size: contain;
}
.checkbox-label {
    font-size: 14px;
    color: #555;
    line-height: 1.1;
}
.checkbox-label b {
    font-weight: 700;
    color: #000;
}

/* Primary Button */
.primary-btn {
  margin-top: 20px;
  background: #22242a;
  color: #ffffff;
  border: 1px solid #22242a;
  height: 45px;
  font-weight: 400;
  cursor: pointer;
  font-size: 18px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: background 0.2s ease, color 0.2s ease;
}
.primary-btn:hover {
  background: #ffffff;
  color: #22242a;
}

.primary-btn:disabled {
  opacity: 0.7;
}

/* Social Buttons */
.social-title {
  font-size: 17px;
  color: #000000;
  margin-top: 20px;
  margin-bottom: 1px;
  font-weight: 400;
  text-align: center;
}
.social-buttons {
  display: flex;
  justify-content: center;
}
.social-btn {
  width: 45px;
  height: 45px;
  border-radius:3px;
  border: 1px solid #c4c4c4;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error {
  margin-top: 10px;
  color: #b91c1c;
  font-size: 13px;
  text-align: center;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
  }
  .auth-hero {
    min-height: 200px;
    flex: none;
  }
  .hero-overlay {
    left: 20px;
    bottom: 20px;
  }
  .hero-overlay h1 {
    font-size: 32px;
  }
  .auth-panel {
    padding: 30px 20px;
  }
  .form-row {
      gap: 10px;
  }
}
</style>
