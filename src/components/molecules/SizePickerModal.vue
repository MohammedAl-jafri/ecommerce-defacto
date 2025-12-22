<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'BEDEN' },
  options: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'choose'])
</script>

<template>
  <transition name="size-fade">
    <div v-if="open" class="size-overlay" @click.self="emit('close')">
      <div class="size-panel">
        <div class="size-head">
          <span class="size-title">{{ title }}</span>
          <button class="size-close" type="button" @click="emit('close')">✕</button>
        </div>

        <div class="size-grid">
          <button
            v-for="s in options"
            :key="s"
            type="button"
            class="size-btn"
            @click="emit('choose', s)"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.size-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1200;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.size-panel {
  width: 520px;
  max-width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 18px 18px 22px;
}

.size-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.size-title {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #111;
}

.size-close {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.size-btn {
  height: 44px;
  border: 1px solid #111;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
}

.size-btn:hover {
  background: #f3f4f6;
}

.size-fade-enter-active,
.size-fade-leave-active {
  transition: opacity 0.2s ease;
}

.size-fade-enter-from,
.size-fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .size-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
