<script setup>
const props = defineProps({
  subTotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  loading: { type: Boolean, default: false },
  step: { type: Number, required: true }, // 1 أو 2
})

const emit = defineEmits(['primary'])

const buttonText = () => {
  if (props.step === 1) return 'ONAYLA VE ÖDE'
  return props.loading ? 'İŞLENİYOR...' : 'ÖDEMEYİ TAMAMLA'
}
</script>

<template>
  <!-- ✅ بدون summary-box هنا (لأنها موجودة في Checkout.vue) -->
  <div class="summary-item">
    <span>ARA TOPLAM</span>
    <span class="summary-bold">{{ subTotal.toFixed(2) }} TL</span>
  </div>

  <div class="summary-item">
    <span>
      KARGO
      <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="vertical-align: middle;">
        <path
          d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895">
        </path>
      </svg>
    </span>
    <span class="summary-bold">ÜCRETSİZ</span>
  </div>

  <div class="summary-item" v-if="discount > 0">
    <span>TOPLAM İNDİRİM</span>
    <span class="summary-bold" style="color:#000">-{{ discount }} TL</span>
  </div>

  <div class="total-section">
    <span class="total-label">TOPLAM</span>
    <span class="total-amount">{{ total.toFixed(2) }} TL</span>
  </div>

  <div class="payment-note">
    <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="min-width:12px;">
      <path
        d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895">
      </path>
    </svg>
    <span>BU ADIMDA ÖDEME ALINMAYACAKTIR.</span>
  </div>

  <button class="button" @click="emit('primary')" :disabled="loading">
    {{ buttonText() }}
  </button>
</template>
