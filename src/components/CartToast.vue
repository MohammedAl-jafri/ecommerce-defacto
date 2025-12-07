<script setup>
import { useToast } from '../stores/useToast'
import { RouterLink } from 'vue-router'

const toast = useToast()
</script>

<template>
  <transition name="toast-slide">
    <div v-if="toast.visible" class="cart-toast">
      <div class="cart-toast-inner">
        
        <div class="cart-toast-left">
          <svg 
            class="icon-success" 
            width="18" 
            height="18" 
            viewBox="0 0 20 20"
          >
            <path 
              fill="currentColor" 
              fill-rule="evenodd" 
              d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.523 0 10 0M1.026 10A8.98 8.98 0 0 1 10 1.026a8.974 8.974 0 0 1 0 17.948A8.98 8.98 0 0 1 1.026 10"
            />
            <path 
              fill="currentColor" 
              d="m5.777 10.265 2.522 2.522 6.424-6.424a.595.595 0 0 1 .841.841l-7.265 7.264-3.362-3.361a.595.595 0 0 1 .841-.841z"
            />
          </svg>

          <span class="cart-toast-text">
            {{ toast.message }}
          </span>
        </div>

        <RouterLink to="/cart" class="cart-toast-right">
          <span class="cart-toast-link-text">SEPETE GİT</span>
          
          <svg class="icon-arrow" viewBox="0 0 7 12">
            <path 
              fill="currentColor" 
              d="M.522 0a.52.52 0 0 0-.369.153.52.52 0 0 0 0 .738L5.262 6 .153 11.109a.522.522 0 0 0 .738.738l5.478-5.478a.52.52 0 0 0 0-.738L.891.153A.52.52 0 0 0 .522 0"
            />
          </svg>
        </RouterLink>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* =========================================
   Container Positioning
   ========================================= */
.cart-toast {
  position: fixed;
  top: 90px;      /* المسافة العلوية */
  right: 80px;    /* المسافة من اليمين */
  z-index: 9999;
}

/* =========================================
   Inner Box Style (White Frame)
   ========================================= */
.cart-toast-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  /* العرض ثابت نسبياً ليشبه الموقع */
  min-width: 480px; 
  max-width: 600px;

  padding: 18px 24px;
  background: #ffffff;
  
  /* تدوير الزوايا خفيف جداً */
  border-radius: 2px;
  
  /* الظل والحدود */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
}

/* =========================================
   Left Section (Icon + Message)
   ========================================= */
.cart-toast-left {
  display: flex;
  align-items: center;
}

/* تنسيق الأيقونة بناءً على صورة DevTools */
.icon-success {
  color: #0aca6e;    /* ✅ اللون الأخضر من الصورة */
  width: 18px;       /* ✅ العرض من الصورة */
  height: 18px;      /* ✅ الطول من الصورة */
  margin-right: 10px; /* مسافة بين الأيقونة والنص */
  flex-shrink: 0;
}

.cart-toast-text {
  font-family: sans-serif; /* يفضل استخدام خط الموقع الرسمي */
  font-size: 13px;
  font-weight: 400;      /* سمك الخط متوسط */
  color: #22242a;
  text-transform: uppercase; /* تحويل الأحرف لكبيرة */
  letter-spacing: 0.04em;
}

/* =========================================
   Right Section (Link + Arrow)
   ========================================= */
.cart-toast-right {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: unset;
  transition: opacity 0.2s;
}

.cart-toast-right:hover {
  opacity: 0.7;
}

.cart-toast-link-text {
  font-family: sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.icon-arrow {
  width: 6px;
  height: 10px;
  color: #000000;
  display: block;
}

/* =========================================
   Animation (Slide Down/Up)
   ========================================= */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* =========================================
   Mobile Responsiveness
   ========================================= */
@media (max-width: 768px) {
  .cart-toast {
    top: 20px;
    right: 16px;
    left: 16px;
  }
  
  .cart-toast-inner {
    min-width: unset;
    width: 100%;
    padding: 16px;
  }
  
  .cart-toast-text {
    font-size: 12px;
  }
}
</style>