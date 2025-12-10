<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()
const route = useRoute()

const loginMode = ref('email')
const showPassword = ref(false) // للتحكم في إظهار كلمة المرور

// email login
const email = ref('')
const password = ref('')

// phone login 
const phoneNumber = ref('')
const phonePassword = ref('')

// متغير جديد لتتبع التركيز في حقل الهاتف بصفحة الدخول
const isPhoneLoginFocused = ref(false)

// دالة تنسيق الرقم (Mask) الخاصة بصفحة الدخول
const formatPhoneNumber = (event) => {
  let val = event.target.value.replace(/\D/g, '')

  // حذف الصفر من البداية
  if (val.startsWith('0')) val = val.substring(1)
  
  // الحد الأقصى 10 أرقام
  val = val.substring(0, 10)

  let formatted = ''
  if (val.length > 0) formatted = '0(' + val.substring(0, 3)
  if (val.length > 3) formatted += ') ' + val.substring(3, 6)
  if (val.length > 6) formatted += ' ' + val.substring(6, 8)
  if (val.length > 8) formatted += ' ' + val.substring(8, 10)

  phoneNumber.value = formatted
}


const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''

  if (loginMode.value === 'phone') {
    error.value = 'Telefon ile giriş bu projede sadece arayüz (demo). Lütfen e-posta ile giriş yapın.'
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
    <div class="auth-hero">
      <div class="hero-overlay">
        <h1>HEMEN GİRİŞ YAP</h1>
        <p>DeFacto İLE TRENDLERİN MODA DÜNYASI</p>
      </div>
    </div>

    <div class="auth-panel">
      <div class="auth-tabs">
        <RouterLink to="/login" class="tab active">
          GİRİŞ YAP
        </RouterLink>
        <RouterLink to="/register" class="tab">
          ÜYE OL
        </RouterLink>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="login-method">
          <label class="radio" :class="{ active: loginMode === 'email' }">
            <input type="radio" value="email" v-model="loginMode" />
            <span class="radio-mark"></span>
            <span class="radio-text">E-POSTA</span>
          </label>
          <label class="radio" :class="{ active: loginMode === 'phone' }">
            <input type="radio" value="phone" v-model="loginMode" />
            <span class="radio-mark"></span>
            <span class="radio-text">TELEFON</span>
          </label>
        </div>

        <template v-if="loginMode === 'email'">
          <div class="form-group">
            <input
              v-model="email"
              type="email"
              class="custom-input"
              placeholder=" "
            />
            <label class="floating-label">E-POSTA ADRESİNİZ</label>
          </div>

          <div class="form-group password-group">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="custom-input"
              placeholder=" "
            />
            <label class="floating-label">ŞİFRE</label>

            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="24" height="18" viewBox="0 0 24 12"><path fill="#22242A" fill-rule="evenodd" d="M12 3c-1.645 0-2.978 1.343-2.978 3S10.355 9 12 9s2.978-1.343 2.978-3S13.645 3 12 3M9.767 6c0-1.243 1-2.25 2.233-2.25A2.24 2.24 0 0 1 14.233 6c0 1.243-1 2.25-2.233 2.25A2.24 2.24 0 0 1 9.767 6" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="M12 0C8.18 0 5.222 1.444 3.223 2.882c-1 .72-1.761 1.439-2.274 1.98a13 13 0 0 0-.733.845l-.04.05-.01.015-.003.004-.001.001.3.221-.3-.22-.162.22.161.22.3-.22-.3.22.002.002.003.004.01.014a5 5 0 0 0 .19.237c.131.16.326.384.583.657.513.541 1.274 1.26 2.274 1.98C5.222 10.556 8.18 12 12 12c3.82 0 6.778-1.444 8.777-2.882 1-.72 1.761-1.439 2.274-1.98a13 13 0 0 0 .733-.845l.04-.05.01-.015.004-.005-.3-.223.3.222L24 6l-.161-.222-.3.222.3-.222h-.001l-.004-.006-.01-.014-.04-.051-.15-.188c-.131-.16-.326-.386-.582-.657a16 16 0 0 0-2.275-1.98C18.778 1.444 15.82 0 12 0M1.487 6.62a12 12 0 0 1-.548-.618L.937 6l.002-.002c.121-.148.304-.361.548-.618.487-.514 1.214-1.2 2.169-1.887C5.565 2.119 8.376.75 12 .75c3.625 0 6.435 1.369 8.344 2.743a15.5 15.5 0 0 1 2.17 1.887c.243.257.426.47.547.618l.002.002-.002.002c-.121.148-.304.361-.548.618-.487.514-1.214 1.2-2.169 1.887-1.909 1.374-4.72 2.743-8.344 2.743-3.625 0-6.435-1.369-8.344-2.743a15.5 15.5 0 0 1-2.17-1.887" clip-rule="evenodd"></path></svg>
                <svg v-else width="24" height="18" viewBox="0 0 24 18"><path fill="currentColor" fill-rule="evenodd" d="M17.445 3.906 20.56.79a.372.372 0 0 0-.527-.527l-3.36 3.361A14.7 14.7 0 0 0 12 2.87c-3.82 0-6.778 1.433-8.777 2.86-1 .714-1.761 1.428-2.274 1.965a13 13 0 0 0-.733.839l-.04.05-.01.015-.003.004-.001.001.3.221-.3-.22-.162.22.161.22.3-.22-.3.22.002.002.003.004.01.014a5 5 0 0 0 .19.237c.131.16.326.384.583.652a16 16 0 0 0 2.274 1.965 15.7 15.7 0 0 0 3.333 1.824l-3.117 3.116a.372.372 0 1 0 .527.527l3.36-3.362c1.374.46 2.935.756 4.674.756 3.82 0 6.778-1.433 8.777-2.86 1-.715 1.761-1.429 2.274-1.966a13 13 0 0 0 .733-.838l.04-.05.01-.015.004-.005-.3-.221.3.22.162-.22-.161-.22-.3.22.3-.22-.005-.006-.01-.014-.04-.051-.15-.186a13 13 0 0 0-.582-.653 16 16 0 0 0-2.275-1.964 15.7 15.7 0 0 0-3.332-1.824m-1.364.31A14 14 0 0 0 12 3.614c-3.625 0-6.435 1.359-8.344 2.722a15.4 15.4 0 0 0-2.17 1.874c-.243.255-.426.466-.547.613l-.002.002.002.002c.121.147.304.358.548.613.487.51 1.214 1.192 2.169 1.874a15 15 0 0 0 3.476 1.853l2.516-2.516a2.978 2.978 0 0 1 4.178-4.178zm-1.729 2.782 2.516-2.516a15 15 0 0 1 3.476 1.853 15.4 15.4 0 0 1 2.17 1.874c.243.255.426.466.547.613l.002.002-.002.002c-.121.147-.304.358-.548.613a15.4 15.4 0 0 1-2.169 1.874c-1.909 1.363-4.72 2.722-8.344 2.722-1.502 0-2.865-.233-4.08-.604l2.254-2.255a2.978 2.978 0 0 0 4.178-4.178m-1.058.006a2.233 2.233 0 0 0-3.114 3.114zm-2.588 3.64L13.82 7.53a2.233 2.233 0 0 1-3.114 3.114" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </template>

        <template v-else>
          <div class="form-group">
            <input
              v-model="phoneNumber"
              type="tel"
              class="custom-input phone-input"
              :placeholder="isPhoneLoginFocused && !phoneNumber ? '0(___) ___ __ __' : ' '"
              @focus="isPhoneLoginFocused = true"
              @blur="isPhoneLoginFocused = false"
              @input="formatPhoneNumber"
              autocomplete="off"
              maxlength="17"
            />
            <label class="floating-label">TELEFON NUMARANIZ</label>
          </div>
          <div class="form-group password-group">
            <input
              v-model="phonePassword"
              :type="showPassword ? 'text' : 'password'"
              class="custom-input"
              placeholder=" "
            />
            <label class="floating-label">ŞİFRE</label>

            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="24" height="18" viewBox="0 0 24 12"><path fill="#22242A" fill-rule="evenodd" d="M12 3c-1.645 0-2.978 1.343-2.978 3S10.355 9 12 9s2.978-1.343 2.978-3S13.645 3 12 3M9.767 6c0-1.243 1-2.25 2.233-2.25A2.24 2.24 0 0 1 14.233 6c0 1.243-1 2.25-2.233 2.25A2.24 2.24 0 0 1 9.767 6" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="M12 0C8.18 0 5.222 1.444 3.223 2.882c-1 .72-1.761 1.439-2.274 1.98a13 13 0 0 0-.733.845l-.04.05-.01.015-.003.004-.001.001.3.221-.3-.22-.162.22.161.22.3-.22-.3.22.002.002.003.004.01.014a5 5 0 0 0 .19.237c.131.16.326.384.583.657.513.541 1.274 1.26 2.274 1.98C5.222 10.556 8.18 12 12 12c3.82 0 6.778-1.444 8.777-2.882 1-.72 1.761-1.439 2.274-1.98a13 13 0 0 0 .733-.845l.04-.05.01-.015.004-.005-.3-.223.3.222L24 6l-.161-.222-.3.222.3-.222h-.001l-.004-.006-.01-.014-.04-.051-.15-.188c-.131-.16-.326-.386-.582-.657a16 16 0 0 0-2.275-1.98C18.778 1.444 15.82 0 12 0M1.487 6.62a12 12 0 0 1-.548-.618L.937 6l.002-.002c.121-.148.304-.361.548-.618.487-.514 1.214-1.2 2.169-1.887C5.565 2.119 8.376.75 12 .75c3.625 0 6.435 1.369 8.344 2.743a15.5 15.5 0 0 1 2.17 1.887c.243.257.426.47.547.618l.002.002-.002.002c-.121.148-.304.361-.548.618-.487.514-1.214 1.2-2.169 1.887-1.909 1.374-4.72 2.743-8.344 2.743-3.625 0-6.435-1.369-8.344-2.743a15.5 15.5 0 0 1-2.17-1.887" clip-rule="evenodd"></path></svg>
                <svg v-else width="24" height="18" viewBox="0 0 24 18"><path fill="currentColor" fill-rule="evenodd" d="M17.445 3.906 20.56.79a.372.372 0 0 0-.527-.527l-3.36 3.361A14.7 14.7 0 0 0 12 2.87c-3.82 0-6.778 1.433-8.777 2.86-1 .714-1.761 1.428-2.274 1.965a13 13 0 0 0-.733.839l-.04.05-.01.015-.003.004-.001.001.3.221-.3-.22-.162.22.161.22.3-.22-.3.22.002.002.003.004.01.014a5 5 0 0 0 .19.237c.131.16.326.384.583.652a16 16 0 0 0 2.274 1.965 15.7 15.7 0 0 0 3.333 1.824l-3.117 3.116a.372.372 0 1 0 .527.527l3.36-3.362c1.374.46 2.935.756 4.674.756 3.82 0 6.778-1.433 8.777-2.86 1-.715 1.761-1.429 2.274-1.966a13 13 0 0 0 .733-.838l.04-.05.01-.015.004-.005-.3-.221.3.22.162-.22-.161-.22-.3.22.3-.22-.005-.006-.01-.014-.04-.051-.15-.186a13 13 0 0 0-.582-.653 16 16 0 0 0-2.275-1.964 15.7 15.7 0 0 0-3.332-1.824m-1.364.31A14 14 0 0 0 12 3.614c-3.625 0-6.435 1.359-8.344 2.722a15.4 15.4 0 0 0-2.17 1.874c-.243.255-.426.466-.547.613l-.002.002.002.002c.121.147.304.358.548.613.487.51 1.214 1.192 2.169 1.874a15 15 0 0 0 3.476 1.853l2.516-2.516a2.978 2.978 0 0 1 4.178-4.178zm-1.729 2.782 2.516-2.516a15 15 0 0 1 3.476 1.853 15.4 15.4 0 0 1 2.17 1.874c.243.255.426.466.547.613l.002.002-.002.002c-.121.147-.304.358-.548.613a15.4 15.4 0 0 1-2.169 1.874c-1.909 1.363-4.72 2.722-8.344 2.722-1.502 0-2.865-.233-4.08-.604l2.254-2.255a2.978 2.978 0 0 0 4.178-4.178m-1.058.006a2.233 2.233 0 0 0-3.114 3.114zm-2.588 3.64L13.82 7.53a2.233 2.233 0 0 1-3.114 3.114" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </template>

        <div class="remember-row">
          <label class="checkbox">
            <input type="checkbox" checked />
            <span class="checkbox-text">Beni Hatırla</span>
          </label>
          <button type="button" class="link-btn">
            ŞİFREMİ UNUTTUM
          </button>
        </div>

        <button type="submit" :disabled="loading" class="primary-btn">
          {{ loading ? 'Giriş yapılıyor…' : 'GİRİŞ YAP' }}
        </button>

        <button type="button" class="secondary-btn">
           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" class="btn-icon">
                <path d="M6.02566 2.24072C3.37451 3.47474 1.16137 4.52319 1.10605 4.57886L1 4.67628V10.7536C1 16.469 1.00461 16.8309 1.08299 16.919C1.1706 17.0257 10.8254 21.5211 10.9637 21.5211C11.0144 21.5211 11.5908 21.2474 12.2501 20.918C12.9094 20.584 13.4673 20.3149 13.4858 20.3149C13.5088 20.3149 13.5964 20.4448 13.6794 20.6025C13.9099 21.0479 14.1866 21.419 14.5647 21.7809C16.326 23.4649 19.1062 23.3953 20.7845 21.6278C21.3378 21.0432 21.7205 20.3427 21.9187 19.5448C22.0294 19.1087 22.0248 18.0046 21.9187 17.5592C21.702 16.6871 21.3424 16.0561 20.6784 15.3835L20.1805 14.8871V9.80256C20.1805 6.35102 20.1667 4.6902 20.1344 4.62989C20.0744 4.51855 11.0974 -0.00463295 10.9499 5.72205e-06C10.8899 5.72205e-06 8.67681 1.01134 6.02566 2.24072ZM11.5677 1.09021L12.1717 1.39639L11.8997 1.54485C11.7521 1.62835 9.9217 2.58866 7.84227 3.67886L4.05228 5.65514L3.17164 5.25154C2.68751 5.02422 2.29099 4.83401 2.29099 4.8201C2.29099 4.80154 10.9038 0.788664 10.9499 0.784023C10.9545 0.784023 11.2311 0.923199 11.5677 1.09021ZM14.7491 2.73711C14.6892 2.79278 6.97085 6.96803 6.92474 6.96803C6.85558 6.96803 4.91448 6.06339 4.93753 6.04019C4.94676 6.02628 6.76798 5.07061 8.98111 3.91546L13.0016 1.81392L13.8915 2.25928C14.3849 2.50515 14.7675 2.71856 14.7491 2.73711ZM17.2988 3.97113C18.1979 4.42577 18.9356 4.80618 18.9356 4.8201C18.9356 4.83401 17.1374 5.74793 14.9427 6.85205L10.9499 8.86081L9.35919 8.12318C8.29873 7.62679 7.79155 7.36699 7.83305 7.3438C8.09125 7.18143 15.5606 3.15464 15.6021 3.15C15.6343 3.15 16.3997 3.52113 17.2988 3.97113ZM2.92266 5.94741L3.94623 6.4206L3.95085 9.76544C3.95085 12.8876 3.95546 13.1196 4.03384 13.2077C4.12144 13.3144 6.7772 14.4696 6.92935 14.4696C6.98468 14.4696 7.0769 14.4278 7.13684 14.3814L7.24749 14.2933L7.27055 11.1386L7.2936 7.984L8.9304 8.74019L10.5672 9.50101L10.581 15.0263C10.5856 18.0603 10.581 20.5469 10.5672 20.5469C10.5534 20.5469 8.56615 19.6283 6.15476 18.5056L1.76076 16.469L1.74693 10.9391C1.73771 5.68762 1.74232 5.41391 1.81609 5.44174C1.8622 5.4603 2.36016 5.68762 2.92266 5.94741ZM19.4428 9.96493V14.5113L19.2491 14.4232C19.1385 14.3768 18.8757 14.2886 18.659 14.233C18.1057 14.0799 17.1052 14.0799 16.5427 14.2283C15.7081 14.4464 15.1087 14.7989 14.4863 15.4206C13.8546 16.0608 13.4812 16.7149 13.2829 17.5592C13.1999 17.9118 13.1722 18.8675 13.2322 19.3036L13.2691 19.568L12.3008 20.0597L11.328 20.5469V15.0263V9.50565L15.3762 7.46906C17.5985 6.34638 19.4243 5.42782 19.4336 5.42782C19.4382 5.42319 19.4428 7.46906 19.4428 9.96493ZM5.97033 7.36236L6.53284 7.62215V10.5773V13.5324L5.94728 13.2819C5.61992 13.1428 5.20495 12.9618 5.02514 12.883L4.68856 12.7391V9.75616V6.77318L5.04819 6.93555C5.24184 7.02834 5.6568 7.21854 5.97033 7.36236ZM18.4745 14.9474C18.9356 15.0773 19.2491 15.2118 19.5949 15.4438C21.5637 16.7335 21.8542 19.503 20.1989 21.1685C18.5437 22.834 15.7911 22.5417 14.5093 20.5608C13.6241 19.2061 13.7394 17.4061 14.786 16.1628C15.3393 15.5087 16.0447 15.0912 16.9069 14.9056C17.2758 14.8268 18.1149 14.85 18.4745 14.9474Z" fill="#585562"/>
                <path d="M17.8001 18.9936L17.8001 16.4546C17.8001 16.2033 17.6212 16 17.4001 16C17.179 16 17.0001 16.2033 17.0001 16.4546L17.0001 19.1818C17.0001 19.3025 17 19.5 17 19.5C17 19.5 18.3977 19.5 18.5 19.5C18.6023 19.5 20 19.5 20 19.5C20.1563 19.3224 20.1563 19.1775 20 19L17.8001 18.9936Z" fill="#585562"/>
           </svg>
           KARGO TAKİP
        </button>

        <div class="guest-block">
          <button type="button" class="text-link">
            ÜYE OLMADAN DEVAM ET
          </button>

          <p class="social-title">SOSYAL HESAP İLE ÜYE OL</p>
          <div class="social-buttons">
            <button type="button" class="social-btn">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none"><path d="M11.8124 10.9704C11.8124 10.2469 11.7424 9.5 11.6257 8.7998H1.51953V12.931H7.3078C7.07441 14.2613 6.30419 15.4283 5.16054 16.1752L8.61484 18.8593C10.6454 16.9687 11.8124 14.2146 11.8124 10.9704Z" fill="#4280EF"/><g clip-path="url(#clip0_3056_116949)"><path d="M21 10.5C21 4.70101 16.299 0 10.5 0C4.70101 0 0 4.70101 0 10.5C0 15.7408 3.83968 20.0847 8.85938 20.8724V13.5352H6.19336V10.5H8.85938V8.18672C8.85938 5.55516 10.427 4.10156 12.8254 4.10156C13.9742 4.10156 15.1758 4.30664 15.1758 4.30664V6.89062H13.8518C12.5475 6.89062 12.1406 7.70007 12.1406 8.53043V10.5H15.0527L14.5872 13.5352H12.1406V20.8724C17.1603 20.0847 21 15.741 21 10.5Z" fill="#1877F2"/><path d="M14.5872 13.5352L15.0527 10.5H12.1406V8.53043C12.1406 7.70007 12.5475 6.89062 13.8518 6.89062H15.1758V4.30664C15.1758 4.30664 13.9742 4.10156 12.8254 4.10156C10.427 4.10156 8.85938 5.55516 8.85938 8.18672V10.5H6.19336V13.5352H8.85938V20.8724C9.39401 20.9563 9.94178 21 10.5 21C11.0582 21 11.606 20.9563 12.1406 20.8724V13.5352H14.5872Z" fill="white"/></g><defs><clipPath id="clip0_3056_116949"><rect width="21" height="21" fill="white"/></clipPath></defs></svg>
            </button>
            <button type="button" class="social-btn">
                <svg viewBox="0 0 48 48" width="24" height="24"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>

/* RESET & FONTS */
*, *::before, *::after {
  box-sizing: border-box;
}


.auth-page {
  display: flex;
  min-height: calc(100vh - 60px);
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- LEFT: HERO --- */
.auth-hero {
  flex: 1.5; /* Slightly larger like original */
  background-image: url('https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg');
  background-size: cover;
  background-position: top center;
  position: relative;
}

/* OVERLAY TEXT */
.hero-overlay {
  position: absolute;
  left: 60px;
  bottom: 80px; /* Adjusted position */
  color: #ffffff;
}
.hero-overlay h1 {
  font-size: 60px; /* Larger like original */
  font-weight: 300; /* Thinner font */
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

/* --- RIGHT: FORM PANEL --- */
.auth-panel {
  flex: 1;
  max-width: 600px; /* Prevent it from getting too wide */
  background: #ffffff;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.auth-tabs {
  display: flex;
  /* خط رمادي فاتح كامل في الأسفل */
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
  color: #22242a; /* لون رمادي للنص غير النشط */
  font-weight: 400;
  position: relative; /* ضروري لتموضع الخط المتحرك */
  transition: color 0.3s ease; /* تنعيم تغير لون النص */
}

/* العنصر الزائف الذي سيشكل الخط الأسود */
.tab::after {
  content: '';
  position: absolute;
  bottom: -1px; /* ليغطي الخط الرمادي */
  left: 0;
  width: 0%; /* البداية: العرض صفر (مخفي) */
  height: 1px; /* سماكة الخط */
  background-color: #22242a; /* لون الخط (أسود) */
  transition: width 0.3s ease; /* حركة التمدد */
}

/* عند مرور الماوس (Hover) */
.tab:hover {
  color: #22242a; /* يتحول النص للأسود */
}
.tab:hover::after {
  width: 100%; /* يتمدد الخط ليملأ العرض */
}

/* الحالة النشطة (Active) */
.tab.active,
.tab.router-link-active {
  color: #22242a;
  font-weight: 700;
}
/* الخط يبقى ظاهراً دائماً للعنصر النشط */
.tab.active::after,
.tab.router-link-active::after {
  width: 100%;
}

/* Login Method Radios */
.login-method {
  display: flex;
  gap: 20px;
  font-size: 15px;
  margin-bottom: 30px;
  font-weight: 400;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  cursor: pointer;
  color: #000000;
}

.radio input {
  accent-color: #000; /* Make radio black */
  width: 17px;
  height: 13px;
  cursor: pointer;
}

.radio-text {
  font-size: 14px;
  font-weight: 400;
}

/* Form Fields */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}


.form-group {
  position: relative;
  width: 100%;
}

.custom-input {
  width: 100%;
  height: 40px;
  border: none;
  border-bottom: 1px solid #000000; /* خط رمادي فقط */
  border-radius: 0;
  font-size: 18px;
  color: #22242a;
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
}


.custom-input::placeholder {
  color: #000000;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
}

/* ✅ تعديل لإظهار الـ Placeholder الرمادي عند الضغط */
.phone-input:focus::placeholder {
  color: #000000;
  font-weight: 400;
  opacity: 1;
  font-size: 18px;
  letter-spacing: 2px;
}


/* PASSWORD EYE ICON */
.eye-btn {
  position: absolute;
  right: 0;
  top: 60%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #000000;
}

.eye-btn svg {
  width: 20px;       
  height: auto;      
}

/* REMEMBER / FORGOT */
.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.checkbox input {
  accent-color: #22242a;
  width: 13px;
  height: 13px;
  cursor: pointer;
}
.checkbox-text {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}
.link-btn {
  background: none;
  border: none;
  padding: 0;
  color: #908e97;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}
.link-btn:hover {
  text-decoration: underline;
  color: #22242a;
}

/* =========================================
   إضافة تأثير النص العائم (Floating Label)
   ========================================= */

/* 1. تنسيق النص المتحرك (Label) */
.floating-label {
  position: absolute;
  left: 0;
  top: 6px; /* مكان النص الابتدائي (وسط الحقل) */
  font-size: 17px; /* نفس حجم خطك الأصلي */
  font-weight: 400;
  color: #000000; /* لون النص وهو في الوسط */
  pointer-events: none; /* يسمح بالضغط على الحقل من خلال النص */
  transition: 0.2s ease all; /* سرعة الحركة */
  text-transform: uppercase;
}

/* 2. تعديل الحقل لترك مساحة للنص عندما يصعد */
.custom-input {
  padding-top: 15px; /* إنزال النص المكتوب قليلاً للأسفل */
}

/* 3. إلغاء الـ placeholder الافتراضي */
.custom-input::placeholder {
  color: transparent;
}

/* 4. الحركة السحرية: عند الضغط أو وجود نص */
.custom-input:focus ~ .floating-label,
.custom-input:not(:placeholder-shown) ~ .floating-label {
  top: -8px;       /* يرتفع للأعلى */
  font-size: 11px;  /* يصغر حجم الخط */
  color: #908e97;   /* يتغير لونه للرمادي */
}

/* Buttons */
.primary-btn {
  margin-top: 10px;
  background: #1f1f1f; /* Almost black */
  color: #ffffff;
  border: none;
  height: 40px;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  letter-spacing: 0.05em;
  transition: opacity 0.2s;
}

.primary-btn:hover {
  opacity: 0.9;
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.secondary-btn {
  height: 40px;
  border: 1px solid #1f1f1f;
  background: #ffffff;
  color: #747373;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Space between Icon and Text */
  letter-spacing: 0.05em;
  transition: background 0.2s;
}

.btn-icon {
  margin-right: 5px;
}

/* Social & Guest */
.guest-block {
  margin-top: 10px;
  text-align: center;
}

.text-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
  color: #111;
  font-weight: 500;
  margin-bottom: 5px;
  display: inline-block;
}

.social-title {
  font-size: 17px;
  color: #000000;
  margin-bottom: 15px;
  font-weight: 400;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.social-btn {
  width: 45px;
  height: 45px;
  border-radius: 3px;
  border: 1px solid #c4c4c4;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.social-btn:hover {
  border-color: #7eacf0;
  background: #f9fafb;
}

/* Error */
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
    max-width: 100%;
  }
}

/* --- إخفاء أيقونة العين الافتراضية للمتصفح --- */
.custom-input::-ms-reveal,
.custom-input::-ms-clear {
  display: none !important;
}
</style>
