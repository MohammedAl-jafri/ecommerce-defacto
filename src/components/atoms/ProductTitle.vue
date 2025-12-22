<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <h3 class="title">{{ title }}</h3>
</template>

<style scoped>
.title {
  font-size: 11px;
  font-weight: 400;
  color: #111111;
  margin-top: -45px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
}
</style>
