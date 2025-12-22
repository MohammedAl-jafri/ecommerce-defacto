<!-- src/components/organisms/ProductsGrid.vue -->
<script setup>
import ProductCard from '../ProductCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
})

</script>

<template>
  <div class="grid" v-if="items.length">
    <ProductCard
      v-for="p in items"
      :key="p.id"
      :item="p"
      @detail="$emit('detail', $event)"
    />
  </div>

  <p v-else class="empty-text">
    Filtrelere uygun ürün bulunamadı.
  </p>
</template>

<style scoped>
.grid {
  max-width: 1320px;
  margin: 24px auto 0;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 40px;
}

.empty-text {
  text-align: center;
  margin-top: 30px;
  color: #6b7280;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 8px;
    padding: 0 12px;
  }
}
</style>
