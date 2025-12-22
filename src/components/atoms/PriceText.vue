<script setup>
defineProps({
  price: { type: [Number, String], default: 0 },
  oldPrice: { type: [Number, String, null], default: null },
})
</script>

<template>
  <div class="price-row">
    <span v-if="oldPrice" class="old-price">{{ oldPrice }} TL</span>
    <span :class="['price-main', { 'price-main--discount': oldPrice }]">
      {{ price }} TL
    </span>
  </div>
</template>

<style scoped>
.price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: -10px;
}

.old-price {
  font-size: 11px;
  color: #9ca3af;
  text-decoration: line-through;
}

.price-main {
  font-size: 12px;
  color: #111111;
  font-weight: 500;
}

.price-main--discount {
  padding: 2px 2px;
  background: #111111;
  color: #ffffff;
}
</style>
