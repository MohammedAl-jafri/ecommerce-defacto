<script setup>
defineProps({
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <button
    type="button"
    class="fav-link"
    :class="{ 'fav-link--active': active }"
    @click.stop="emit('toggle')"
    aria-label="Favorilere ekle"
  >
    <svg v-if="active" viewBox="0 0 24 24" class="fav-icon">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#111111"
      />
    </svg>

    <svg v-else viewBox="0 0 20 18" class="fav-icon">
      <path
        fill="currentColor"
        d="M5.197 0a5.06 5.06 0 0 0-3.69 1.6c-2.009 2.13-2.007 5.497 0 7.629l8.101 8.606a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l8.109-8.599c2.009-2.13 2.009-5.498 0-7.629a5.06 5.06 0 0 0-7.381 0L10 2.785 8.887 1.6A5.06 5.06 0 0 0 5.197 0m0 .911c1.047 0 2.096.436 2.922 1.311l1.497 1.592a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l1.489-1.585c1.651-1.751 4.185-1.75 5.836 0s1.651 4.635 0 6.385L10 16.798 2.283 8.606a4.74 4.74 0 0 1 0-6.385C3.108 1.347 4.15.911 5.196.911z"
      />
    </svg>
  </button>
</template>

<style scoped>
.fav-link {
  order: 1;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-8px);
}

.fav-icon {
  width: 12px;
  height: 18px;
  color: #22242a;
}

.fav-link--active .fav-icon {
  color: #111111;
}
</style>
