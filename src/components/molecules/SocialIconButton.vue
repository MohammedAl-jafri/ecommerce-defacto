<script setup>
defineProps({
  ariaLabel: { type: String, required: true },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    class="social-btn"
    type="button"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.social-btn {
  width: 60px;
  height: 50px;
  border: none;
  background: #000000;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.social-btn :deep(svg) {
  width: 22px;
  height: 25px;
  display: block;
}
</style>
