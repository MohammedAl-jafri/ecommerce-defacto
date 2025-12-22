<script setup>
defineProps({
  open: { type: Boolean, default: false },
  sizes: { type: Array, default: () => ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
})

const emit = defineEmits(['close', 'select'])
</script>

<template>
  <div v-if="open" class="card-size-overlay" @click.stop>
    <div class="card-size-header">
      <span class="card-size-label">BEDEN</span>

      <button class="card-size-close" type="button" @click.stop="emit('close')">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 1L1 13M1 1L13 13" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div class="card-size-grid">
      <button
        v-for="s in sizes"
        :key="s"
        type="button"
        class="card-size-option"
        @click.stop="emit('select', s)"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-size-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  padding: 14px 18px 20px;
  z-index: 10;
  box-sizing: border-box;
}

.card-size-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-size-label {
  font-size: 11.5px;
  font-weight: 400;
  color: #111;
  text-transform: uppercase;
  text-align: left;
  margin-left: -15px;
  margin-top: -10px;
}

.card-size-close {
  background: none;
  border: none;
  cursor: default;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.75);
  margin-right: -18px;
  margin-top: -10px;
}

.card-size-grid {
  display: grid;
  grid-template-columns: repeat(5, 2fr);
  gap: 8px;
  margin-left: -14px;
}

.card-size-option {
  height: 35px;
  background: #fff;
  border: 1px solid #111;
  color: #111;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
