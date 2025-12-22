<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] }, // [img1, img2]
  alt: { type: String, default: '' },
  disabled: { type: Boolean, default: false }, // لما showSizes=true نوقف hover
})

const stripX = ref(0)

const onMove = (event) => {
  if (props.disabled) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  const clamped = Math.min(Math.max(ratio, 0), 1)

  if (clamped > 0.52) stripX.value = -50
  else if (clamped < 0.48) stripX.value = 0
}

const onLeave = () => {
  stripX.value = 0
}
</script>

<template>
  <div class="img-wrap" @mousemove="onMove" @mouseleave="onLeave">
    <div class="img-strip" :style="{ transform: `translate3d(${stripX}%, 0, 0)` }">
      <img
        v-for="(src, idx) in images"
        :key="idx"
        class="img"
        :src="src"
        :alt="alt"
      />
    </div>
  </div>
</template>

<style scoped>
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 5.3;
  background: #f5f5f5;
  overflow: hidden;
  cursor: pointer;
}

.img-strip {
  display: flex;
  width: 200%;
  height: 100%;
  transform: translate3d(0, 0, 0);
  transition: transform 0.08s ease-out;
}

.img {
  flex: 0 0 50%;
  width: 50%;
  height: 100%;
  object-fit: cover;
}
</style>
