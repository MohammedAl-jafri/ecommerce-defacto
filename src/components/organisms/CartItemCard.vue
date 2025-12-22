<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  imageSrc: { type: String, required: true },
  isSized: { type: Boolean, default: false },
})

const emit = defineEmits([
  'go-detail',
  'decrease',
  'increase',
  'edit-size',
  'remove',
])

const lineKey = (it) => it?.key || it?.id
</script>

<template>
  <div class="shopping__card--item">
    <div class="shopping-product-card">
      <div class="item-select">
        <div class="custom-checkbox custom-checkbox--black">
          <input :id="'chk-' + lineKey(item)" type="checkbox" checked />
          <label :for="'chk-' + lineKey(item)"></label>
        </div>
      </div>

      <div class="shopping-product-card__image">
        <img
          :src="imageSrc"
          :alt="item.title"
          class="clickable-media"
          @click="emit('go-detail', item)"
        />
        <div class="delivery-estimate">
          TAHMİNİ TESLİMAT: 13 ARALIK - 18 ARALIK
        </div>
      </div>

      <div class="shopping-product-card__info">
        <div class="shopping-product-card__info--title-block">
          <h3 class="product-title interactive-text" @click="emit('go-detail', item)">
            {{ item.title }}
          </h3>

          <div class="item-price-block">
            <span class="shopping-product-card__info--price-new">{{ item.price }} TL</span>
          </div>
        </div>

        <div v-if="isSized" class="shopping-product-card__info--size">
          <span>BEDEN: {{ (item.size || '-').toString().toUpperCase() }}</span>

          <button class="edit-btn" type="button" @click="emit('edit-size', item)">
            <svg viewBox="0 0 19 17.723" width="13" height="13">
              <path
                fill="currentColor"
                d="M13.357 0a2.37 2.37 0 0 0-1.68.693l-9.586 9.584-1.479 5.545 5.545-1.479 9.586-9.586a2.38 2.38 0 0 0 0-3.357l-.707-.707A2.37 2.37 0 0 0 13.357 0m0 .744a1.62 1.62 0 0 1 1.148.479l.707.707a1.62 1.62 0 0 1 0 2.299l-.891.891-3.006-3.004.891-.893a1.62 1.62 0 0 1 1.15-.479zm-2.572 1.9 3.006 3.006-8.021 8.021-4.098 1.094 1.094-4.1zM0 16.723v1h19v-1H.5z"
              ></path>
            </svg>
          </button>
        </div>

        <div class="shopping-product-card__info--controls">
          <div class="qty-selector">
            <div class="control-left-wrapper">
              <button
                v-if="(item.qty || 1) > 1"
                class="minus-icon"
                type="button"
                @click="emit('decrease', item)"
              >
                <svg viewBox="0 0 12 12" width="10" height="10">
                  <path fill="currentColor" d="M0 5.5h12v1H0z"></path>
                </svg>
              </button>

              <button
                v-else
                class="delete-icon"
                type="button"
                @click="emit('remove', item)"
              >
                <svg viewBox="0 0 22 24" width="12" height="12">
                  <path
                    fill="currentColor"
                    d="m19.245 8.816-1.059 11.862c-.076.7-.317 1.262-.728 1.645s-.975.576-1.674.59a248 248 0 0 1-9.652-.006c-.667-.015-1.213-.213-1.606-.59-.4-.383-.637-.941-.713-1.629-.391-3.547-1.057-11.872-1.057-11.872a.524.524 0 0 0-1.045.082l1.06 11.903c.106.963.468 1.731 1.029 2.267.569.544 1.346.86 2.31.88 3.229.069 6.463.065 9.693.006.995-.018 1.791-.33 2.372-.87s.945-1.311 1.053-2.291c.39-3.526 1.062-11.894 1.062-11.894a.523.523 0 0 0-1.045-.083M0 4.851c0-.288.235-.522.524-.522h20.952c.289 0 .524.234.524.522s-.235.522-.524.522H.524A.523.523 0 0 1 0 4.851"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M6.349 1.565A2.11 2.11 0 0 1 8.384 0h5.231c.954 0 1.788.643 2.034 1.565l.007.032.301 1.509a1.515 1.515 0 0 0 1.481 1.223c.289 0 .524.234.524.522s-.235.522-.524.522a2.56 2.56 0 0 1-2.509-2.063l-.296-1.491a1.06 1.06 0 0 0-1.018-.775H8.384a1.06 1.06 0 0 0-1.017.775L7.069 3.31A2.56 2.56 0 0 1 4.56 5.373c-.289 0-.524-.234-.524-.522s.235-.522.524-.522c.717 0 1.34-.509 1.482-1.222l.3-1.51z"
                  ></path>
                </svg>
              </button>
            </div>

            <span class="qty-label">ADET:</span>
            <strong class="qty-val">{{ item.qty || 1 }}</strong>

            <div class="qty-buttons">
              <button type="button" @click="emit('increase', item)">
                <svg viewBox="0 0 12 12" width="10" height="10">
                  <path fill="currentColor" d="M5.5 0v5.5H0v1h5.5V12h1V6.5H12v-1H6.5V0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.clickable-media { cursor: pointer; }
</style>
