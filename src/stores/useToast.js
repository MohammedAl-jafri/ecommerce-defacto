// src/stores/useToast.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToast = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('ÜRÜN SEPETE EKLENDİ')
  let timeoutId = null

  const showCartAdded = (customMessage) => {
    message.value = customMessage || 'ÜRÜN SEPETE EKLENDİ'
    visible.value = true

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      visible.value = false
      timeoutId = null
    }, 2500) // 2.5 ثانية مثل الموقع تقريباً
  }

  const hide = () => {
    visible.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return { visible, message, showCartAdded, hide }
})
