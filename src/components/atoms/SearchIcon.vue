<script setup>
defineProps({
  size: { type: [Number, String], default: 16 },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    class="df-search-svg"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7.3"
      cy="7.3"
      r="6.3"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.2002 12.2L15.0002 15"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.df-search-svg {
  width: 16px;
  height: 16px;
  color: #22242a;
}
</style>
