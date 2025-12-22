<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'ÜRÜN SİL' },
  text: {
    type: String,
    default:
      'BU İŞLEMLE ÜRÜN SEPETİNİZDEN KALDIRILACAKTIR.<br>ONAYLIYOR MUSUNUZ?',
  },
  primaryLabel: { type: String, default: 'SİL VE FAVORİLERE EKLE' },
  secondaryLabel: { type: String, default: 'SİL' },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div id="productDeleteModal" class="modal-container">
      <div class="modal__header">
        <span class="modal__title">{{ title }}</span>

        <button class="modal__close" type="button" @click="emit('close')">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="currentColor"
              d="M14.53 1.47a.75.75 0 0 0-1.06 0L8 6.94 2.53 1.47a.75.75 0 0 0-1.06 1.06L6.94 8l-5.47 5.47a.75.75 0 1 0 1.06 1.06L8 9.06l5.47 5.47a.75.75 0 0 0 1.06-1.06L9.06 8l5.47-5.47a.75.75 0 0 0 0-1.06z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="modal__inner">
        <span class="modal__text" v-html="text"></span>

        <div class="modal__footer">
          <button class="btn-modal btn-black" type="button" @click="emit('confirm', true)">
            {{ primaryLabel }}
          </button>

          <button class="btn-modal btn-white" type="button" @click="emit('confirm', false)">
            {{ secondaryLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  width: 450px;
  max-width: 95%;
  padding: 20px 20px 30px 20px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.modal__title {
  font-size: 16px;
  font-weight: 700;
  color: #22242a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #000;
}

.modal__inner { padding: 0 1px; }

.modal__text {
  font-size: 14px;
  font-weight: 400;
  color: #22242a;
  margin-top: 20px;
  margin-bottom: 25px;
  display: block;
  line-height: 1.5;
}

.modal__footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-modal {
  width: 100%;
  height: 35px;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #22242a;
  transition: all 0.3s ease;
}

.btn-black { background-color: #22242a; color: #fff; }
.btn-black:hover { background-color: #fff; color: #22242a; }

.btn-white { background-color: #fff; color: #22242a; }
.btn-white:hover { background-color: #22242a; color: #fff; }

@media (max-width: 767.98px) {
  .modal-container { width: 100%; margin: 0 10px; }
}
</style>
