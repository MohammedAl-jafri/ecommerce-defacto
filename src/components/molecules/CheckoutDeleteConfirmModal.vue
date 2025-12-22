<script setup>
const props = defineProps({
  loading: { type: Boolean, default: false },
  addressTitle: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="delete-dialog" @click.stop>
      <button class="delete-close" @click="emit('close')">✕</button>

      <h3 class="delete-title">ADRESİ SİL</h3>

      <p class="delete-message">
        {{ addressTitle }} ADRESİNİZİ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?
      </p>

      <button class="delete-confirm-btn" @click="emit('confirm')" :disabled="loading">
        {{ loading ? 'SİLİNİYOR...' : 'SİL' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-dialog {
  background: #fff;
  border-radius: 0;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.delete-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px;
  line-height: 1;
}

.delete-close:hover {
  color: #000;
}

.delete-title {
  font-size: 16px;
  font-weight: 700;
  color: #22242a;
  margin-bottom: 20px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.delete-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 30px;
  text-align: left;
  line-height: 1.6;
  text-transform: uppercase;
}

.delete-confirm-btn {
  width: 100%;
  height: 48px;
  background: #22242a;
  color: #fff;
  border: 1px solid #22242a;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.delete-confirm-btn:hover {
  background: #fff;
  color: #22242a;
}

.delete-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
