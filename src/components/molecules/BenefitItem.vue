<script setup>
defineProps({
  title: { type: String, required: true },
  sub: { type: String, required: true },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button class="benefit-item" type="button" @click="$emit('click')">
    <div class="benefit-icon">
      <slot name="icon" />
    </div>

    <div class="benefit-text">
      <div class="benefit-title">{{ title }}</div>
      <div class="benefit-sub">{{ sub }}</div>
    </div>
  </button>
</template>

<style scoped>
.benefit-item {
  display: flex;
  align-items: center;
  gap: 13px;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.benefit-icon {
  width: 45px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.benefit-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.benefit-sub {
  font-size: 12px;
  color: #22242a;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
