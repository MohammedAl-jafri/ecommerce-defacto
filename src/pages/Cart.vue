<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '../stores/useCart'

const router = useRouter()

const goToDetail = (item) => {
  const pid =
    item?.productId ??
    item?.id
  router.push(`/product/${pid}`)
}

const goFavorites = () => {
  router.push('/favorites')
}

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/products')
}

const { items, total, updateQty, removeFromCart, setItemSize, isSizedCategory } = useCart()


const showModal = ref(false)
const itemToDelete = ref(null)

const openDeleteModal = (item) => {
  itemToDelete.value = item
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  itemToDelete.value = null
}

const confirmDelete = (addToFavorites) => {
  if (itemToDelete.value) {
    if (addToFavorites) {
      console.log(`تمت إضافة المنتج ${itemToDelete.value.id} للمفضلة`)
    }
    removeFromCart(itemToDelete.value.key || itemToDelete.value.id)
  }
  closeModal()
}

const fallback = 'https://via.placeholder.com/120x160.png?text=No+image'
const hasItems = computed(() => items.value.length > 0)
const shippingCost = computed(() => 0)
const discount = computed(() => 0)
const grandTotal = computed(() => total.value)

const getImage = (item) => {
  let img = (item.image || '').toString().trim()
  if (!img) return fallback
  if (img.toLowerCase().startsWith('image:')) {
    img = img.replace(/image:\s*/i, '').trim()
  }
  return img || fallback
}

const lineKey = (item) => item?.key || item?.id

const increaseQty = (item) => {
  updateQty(lineKey(item), (item.qty || 1) + 1)
}

const decreaseQty = (item) => {
  if (item.qty > 1) {
    updateQty(lineKey(item), item.qty - 1)
  } else {
    openDeleteModal(item)
  }
}

const removeLine = (item) => {
  openDeleteModal(item)
}

const sizeOpen = ref(false)
const sizeEditItem = ref(null)

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const sizeOptions = computed(() => {
  const it = sizeEditItem.value
  if (!it) return defaultSizes
  const s = it.sizes || it.availableSizes
  return Array.isArray(s) && s.length ? s : defaultSizes
})

const openSizeEdit = (item) => {
  if (!item) return
  if (!isSizedCategory(item.mainCategory)) return
  sizeEditItem.value = item
  sizeOpen.value = true
}

const closeSize = () => {
  sizeOpen.value = false
  sizeEditItem.value = null
}

const chooseSize = (size) => {
  if (!sizeEditItem.value) return
  setItemSize(lineKey(sizeEditItem.value), size)
  closeSize()
}
</script>

<template>
  <section class="shopping-cart-page">
    
    <div v-if="!hasItems" class="shopping__empty">
      <div class="shopping__empty--icon">
        <svg viewBox="0 0 25 24" width="80" height="80" fill="#22242a">
           <path fill="currentColor" d="M12.502 0c-3.055-.012-5.54 2.53-5.553 5.65V6h-.771l-5.682.031a.5.5 0 0 0-.496.5V23.5a.5.5 0 0 0 .5.5h24a.5.5 0 0 0 .5-.5V6.532a.5.5 0 0 0-.496-.5L18.822 6h-.791v-.324c0-3.12-2.473-5.675-5.527-5.676zM12.5 1h.002c2.499 0 4.529 2.08 4.529 4.676V6H7.949v-.347l-.002.002C7.958 3.059 9.999.989 12.5 1M6.178 7h.772v2.834a.5.5 0 1 0 1 0V7h9.082v2.834a.5.5 0 1 0 1 0V7h.791L24 7.029V23H1V7.03z"></path>
        </svg>
      </div>
      <h2 class="shopping__empty--title">SEPETİNİZDE ÜRÜN YOK.</h2>
      <p class="shopping__empty--info">
        BİNLERCE DEFACTO ÜRÜNÜ SENİ BEKLİYOR.<br>
        AŞAĞIDAKİ ÖNERİLERİ İNCELEYEREK HEMEN ALIŞVERİŞE BAŞLAYABİLİR YA DA KATEGORİ LİNKLERİYLE DEFACTO’YU KEŞFEDEBİLİRSİN..
      </p>
      <RouterLink to="home" class="button button--big button--black mt-4">ANASAYFAYA GİT</RouterLink>
    </div>

    <div v-else class="container shopping__container">
      <div class="shopping-left">
        <div class="shopping__header">
           <div class="shopping__header--title">
             <span class="back-arrow" @click="goBack">
               <svg viewBox="0 0 20 16" width="16" height="10">
                 <path fill="currentColor" d="M8.139 0a.698.686 0 0 0-.494.202L.205 7.515H.203a.698.686 0 0 0-.15.223.698.686 0 0 0-.053.261.698.686 0 0 0 .053.263.698.686 0 0 0 .15.223h.002l7.439 7.314a.698.686 0 0 0 .988 0 .698.686 0 0 0 0-.969L2.379 8.684h16.922A.698.686 0 0 0 20 7.999a.698.686 0 0 0-.699-.685H2.383l6.25-6.143a.698.686 0 0 0 0-.969A.698.686 0 0 0 8.139 0"></path>
               </svg>
             </span> 
             <span>SEPETİM ({{ items.length }} ÜRÜN)</span>
           </div>
           <button class="shopping__header--favorite glow-effect" type="button" @click="goFavorites">
             <svg viewBox="0 0 20 18" width="19" height="18" style="margin-right:5px;">
               <path fill="currentColor" d="M5.197 0a5.06 5.06 0 0 0-3.69 1.6c-2.009 2.13-2.007 5.497 0 7.629l8.101 8.606a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l8.109-8.599c2.009-2.13 2.009-5.498 0-7.629a5.06 5.06 0 0 0-7.381 0L10 2.785 8.887 1.6A5.06 5.06 0 0 0 5.197 0m0 .911c1.047 0 2.096.436 2.922 1.311l1.497 1.592a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l1.489-1.585c1.651-1.751 4.185-1.75 5.836 0s1.651 4.635 0 6.385L10 16.798 2.283 8.606a4.74 4.74 0 0 1 0-6.385C3.108 1.347 4.15.911 5.196.911z"></path>
             </svg>
             <span>FAVORİLERİM</span>
           </button>
        </div>

        <div class="free-shipping-banner">
          <div class="circle-progress"></div> 
          <span><strong>ÜCRETSİZ KARGO</strong> FIRSATINI YAKALADIN!</span>
        </div>

        <div class="shopping-list">
          <div class="shopping-list-container">
           <div v-for="item in items" :key="lineKey(item)" class="shopping__card--item">
            <div class="shopping-product-card">
                <div class="item-select">
                    <div class="custom-checkbox custom-checkbox--black">
                        <input :id="'chk-' + lineKey(item)" type="checkbox" checked>
                        <label :for="'chk-' + lineKey(item)"></label>
                    </div>
                </div>
                <div class="shopping-product-card__image">
                    <img :src="getImage(item)"
                         :alt="item.title"
                         @click="goToDetail(item)"
                         class="clickable-media"
                         />
                  <div class="delivery-estimate">
                    TAHMİNİ TESLİMAT: 13 ARALIK - 18 ARALIK
                  </div>
                </div>  
                <div class="shopping-product-card__info">
                  <div class="shopping-product-card__info--title-block">
                      <h3 class="product-title interactive-text" @click="goToDetail(item)">
                        {{ item.title }}
                      </h3>  
                    <div class="item-price-block">
                       <span class="shopping-product-card__info--price-new">{{ item.price }} TL</span>
                    </div>
                  </div>
                  <div
                    v-if="isSizedCategory(item.mainCategory)"
                    class="shopping-product-card__info--size"
                  >
                    <span>BEDEN: {{ (item.size || '-').toString().toUpperCase() }}</span>
                    <button class="edit-btn" type="button" @click="openSizeEdit(item)">
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
                         <button v-if="item.qty > 1" class="minus-icon" @click="decreaseQty(item)">
                           <svg viewBox="0 0 12 12" width="10" height="10">
                              <path fill="currentColor" d="M0 5.5h12v1H0z"></path>
                           </svg>
                         </button>
                         <button v-else class="delete-icon" @click="openDeleteModal(item)">
                           <svg viewBox="0 0 22 24" width="12" height="12">
                             <path fill="currentColor" d="m19.245 8.816-1.059 11.862c-.076.7-.317 1.262-.728 1.645s-.975.576-1.674.59a248 248 0 0 1-9.652-.006c-.667-.015-1.213-.213-1.606-.59-.4-.383-.637-.941-.713-1.629-.391-3.547-1.057-11.872-1.057-11.872a.524.524 0 0 0-1.045.082l1.06 11.903c.106.963.468 1.731 1.029 2.267.569.544 1.346.86 2.31.88 3.229.069 6.463.065 9.693.006.995-.018 1.791-.33 2.372-.87s.945-1.311 1.053-2.291c.39-3.526 1.062-11.894 1.062-11.894a.523.523 0 0 0-1.045-.083M0 4.851c0-.288.235-.522.524-.522h20.952c.289 0 .524.234.524.522s-.235.522-.524.522H.524A.523.523 0 0 1 0 4.851"></path><path fill="currentColor" d="M6.349 1.565A2.11 2.11 0 0 1 8.384 0h5.231c.954 0 1.788.643 2.034 1.565l.007.032.301 1.509a1.515 1.515 0 0 0 1.481 1.223c.289 0 .524.234.524.522s-.235.522-.524.522a2.56 2.56 0 0 1-2.509-2.063l-.296-1.491a1.06 1.06 0 0 0-1.018-.775H8.384a1.06 1.06 0 0 0-1.017.775L7.069 3.31A2.56 2.56 0 0 1 4.56 5.373c-.289 0-.524-.234-.524-.522s.235-.522.524-.522c.717 0 1.34-.509 1.482-1.222l.3-1.51z"></path>
                           </svg>
                         </button>
                      </div>
                      <span class="qty-label">ADET:</span>
                      <strong class="qty-val">{{ item.qty || 1 }}</strong>
                      <div class="qty-buttons">
                        <button @click="increaseQty(item)">
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
         </div>
       </div>
     </div>

      <div class="shopping-right">
        <div class="shopping__summary-final">
          <div class="shopping__summary-final--content">
              <div class="shopping__summary-final--item">
                <span>ÜRÜN TOPLAMI</span>
                <span class="f-bold">{{ total.toFixed(2) }} TL</span>
              </div>
              <div class="shopping__summary-final--item">
                <span>KARGO</span>
                <span class="f-bold">ÜCRETSİZ</span>
              </div>
              <div class="shopping__summary-final--item discount" v-if="discount > 0">
                <span>TOPLAM İNDİRİM</span>
                <span class="f-bold">-{{ discount }} TL</span>
              </div>
              <div class="shopping__summary-final--item totalAmount">
                  <span class="title">TOPLAM</span>
                  <span class="amount">{{ grandTotal.toFixed(2) }} TL</span>
              </div>
              <RouterLink to="/checkout" class="button button--fluid button--big button--black mt-2">
                ALIŞVERİŞİ TAMAMLA
              </RouterLink>
          </div>
        </div>
        <div class="shopping__coupon">
          <div class="coupon-header">
            <span>İNDİRİM KODUNUZ</span>
            <button class="btn-link">KULLAN</button>
          </div>
        </div>
        <div class="gift-package">
            <div class="custom-checkbox custom-checkbox--black">
                <input id="gift-opt" type="checkbox">
                <label for="gift-opt">
                  <span class="gift-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 18" fill="none">
                      <path d="M7.60282 9.42631L0 5.00848L0.0238183 13.5821L7.62664 18L7.60282 9.42631Z" fill="#FDA623"/>
                      <path d="M15.0637 5.1238L7.46086 0.705017L0 5.01233L7.60282 9.43111L15.0637 5.1238Z" fill="#FFCE1F"/>
                      <path d="M7.60278 9.42633L7.6266 18L15.0884 13.6927L15.0636 5.11902L7.60278 9.42633Z" fill="#FDA623"/>
                      <path d="M12.3493 6.68628L12.3732 15.259L11.0432 16.0135V7.44084L12.3493 6.68628Z" fill="#8B44FF"/>
                      <path d="M11.0431 7.44082L3.44031 3.02205L4.74174 2.26843L12.3446 6.68721L12.3436 6.68912L12.3493 6.68626" fill="#8B44FF"/>
                      <path d="M10.1543 2.27032L11.4538 3.02584L4.0139 7.34935L2.71342 6.59859L2.71246 6.59574L10.1543 2.27032Z" fill="#8B44FF"/>
                      <path d="M4.01385 7.34941L3.99004 15.8888L2.68384 15.1275L2.70766 6.59485L2.71337 6.59866" fill="#8B44FF"/>
                      <g style="mix-blend-mode:multiply" opacity="0.5">
                      <path d="M11.9702 5.01138C12.034 5.39247 12.034 5.8374 12.034 5.8374C12.034 5.8374 9.14434 6.3776 7.68285 5.17049L7.49993 5.01614C7.49993 5.01614 5.7145 6.63103 3.55465 6.21849L3.205 5.04377C3.205 5.04377 3.52226 4.75795 4.0939 4.63124C4.0939 4.63124 3.45843 4.31398 3.17261 3.67851L4.96279 2.54285C4.96279 2.54285 6.34807 3.5194 6.4119 3.58323C6.47574 3.64707 7.07882 3.83761 7.07882 3.83761C7.07882 3.83761 6.85683 3.77378 7.42847 3.01159C8.00011 2.2494 9.33394 2.72577 8.60319 3.93289C7.87244 5.14 9.68264 4.91706 10.2867 4.94945C10.8907 4.98185 11.9702 5.01329 11.9702 5.01329V5.01138Z" fill="#6A52CE"/>
                      </g>
                      <path d="M10.2704 0.655502C10.7782 0.847002 10.0894 3.1107 7.5246 4.97996C7.5246 4.97996 10.4104 1.24143 8.46495 0.0447998C8.46495 0.0447998 8.90701 0.384926 9.4434 0.565945C9.71017 0.656455 10.1027 0.590716 10.2713 0.65455L10.2704 0.655502Z" fill="#8B44FF"/>
                      <path d="M10.2713 0.655481C8.89652 1.28429 8.20388 2.2132 7.85994 3.05065C7.43121 4.0958 7.54268 4.99899 7.54268 4.99899C7.01296 3.77664 6.98724 2.78865 7.17493 2.02551C7.51124 0.65167 8.53353 0 8.53353 0C8.53353 0 8.97083 0.2439 9.28904 0.349653C9.60726 0.455407 10.2713 0.654528 10.2713 0.654528V0.655481Z" fill="#8B44FF"/>
                      <path d="M7.54268 4.999C7.01296 3.77664 6.98724 2.78865 7.17493 2.02551C7.09776 2.44376 7.73323 3.03922 7.85994 3.05065C7.43121 4.0958 7.54268 4.999 7.54268 4.999Z" fill="#8B44FF"/>
                      <path d="M3.04672 2.47234C2.77329 2.56761 4.20334 4.94659 7.55696 4.97612C7.55696 4.97612 3.37541 2.59524 4.51488 1.00037C4.51488 1.00037 4.04995 2.12269 3.04672 2.47139V2.47234Z" fill="#8B44FF"/>
                      <path d="M3.05627 2.47328C3.34686 2.4628 3.63744 2.48566 3.92421 2.53425C4.01472 2.5495 4.10523 2.5676 4.19479 2.58856C4.26529 2.60476 4.3358 2.62286 4.40535 2.64191C4.41487 2.64382 4.42535 2.64668 4.43488 2.64954C4.44631 2.65239 4.45679 2.6562 4.46823 2.65906C5.04368 2.82198 5.58388 3.08017 6.04214 3.36599C6.33177 3.54606 6.58806 3.73851 6.80052 3.9262C7.40169 4.45592 7.53031 4.97421 7.53031 4.97421C7.5246 4.55881 7.52174 4.36922 7.4903 4.09674C7.4055 3.36123 7.03489 2.76767 6.58329 2.30465C6.32891 2.0455 6.05072 1.82733 5.783 1.64821C5.7325 1.61487 5.68296 1.58247 5.63342 1.55103C5.60198 1.53198 5.57149 1.51388 5.541 1.49577C5.52385 1.48529 5.50766 1.47481 5.49051 1.46529C5.44192 1.4367 5.39428 1.40908 5.3476 1.38335C4.88076 1.12516 4.52444 1.00226 4.52444 1.00226C4.52444 1.00226 4.23004 1.37097 3.81084 1.83399C3.40593 2.28273 3.05627 2.47328 3.05627 2.47328Z" fill="#8B44FF"/>
                      <path d="M5.78311 1.64825C6.05083 1.82737 6.32903 2.04554 6.58341 2.30469C6.44241 2.57717 6.16707 3.14595 6.04226 3.36603C5.65926 3.1269 5.21814 2.90777 4.74749 2.74676L4.73511 2.74199C5.01616 2.72484 5.65259 1.95503 5.78311 1.64825Z" fill="#BAA9FF"/>
                      <path opacity="0.6" d="M4.26447 2.60762L4.40547 2.64192L4.46454 2.66098C4.46454 2.66098 4.4674 2.66003 4.46835 2.65907C4.82277 2.4952 5.49444 1.58058 5.54113 1.49578C5.52398 1.4853 5.50778 1.47482 5.49063 1.4653C5.44204 1.4367 5.39441 1.40909 5.34772 1.38336C5.07143 1.94929 4.26447 2.60762 4.26447 2.60762Z" fill="#BAA9FF"/>
                      <path d="M10.4477 5.60589C9.5845 5.64496 8.5384 5.48204 7.49896 4.88563C7.49896 4.88563 9.59784 4.83418 11.0412 4.1263C11.589 3.85858 12.0426 3.49559 12.2512 3.00684C12.2512 3.00684 12.2493 4.54741 12.4703 4.86371C12.6018 5.05236 11.7243 5.54873 10.4477 5.60589Z" fill="#5848BC"/>
                      <path opacity="0.9" d="M10.4477 5.60589C10.664 5.13905 10.8774 4.62363 11.0412 4.1263C11.5891 3.85858 12.0426 3.49559 12.2512 3.00684C12.2512 3.00684 12.2493 4.54741 12.4703 4.86371C12.6018 5.05236 11.7244 5.54873 10.4477 5.60589Z" fill="#403B72"/>
                      <path d="M12.4703 4.86369C12.2312 4.70172 11.9835 4.57787 11.731 4.48355C10.6173 4.07006 9.41684 4.25013 8.57938 4.48545C8.03823 4.63884 7.67047 4.8332 7.55615 4.88751C7.53423 4.89799 7.52661 4.9037 7.52661 4.9037C7.54186 4.88084 7.54852 4.84749 7.56377 4.82463C8.00012 4.16343 8.49649 3.71278 9.02431 3.42125C9.83699 2.96965 10.6773 2.87628 11.2966 2.88962C11.8692 2.90296 12.2522 3.00681 12.2522 3.00681L12.4713 4.86369H12.4703Z" fill="#8B44FF"/>
                    </svg>
                  </span>
                  <span class="gift-text">Özel Hediye Paketi İstiyorum</span>
                </label>
            </div>
        </div>
      </div>
    </div>

    <transition name="size-fade">
      <div v-if="sizeOpen" class="size-overlay" @click.self="closeSize">
        <div class="size-panel">
          <div class="size-head">
            <span class="size-title">BEDEN</span>
            <button class="size-close" type="button" @click="closeSize">✕</button>
          </div>

          <div class="size-grid">
            <button
              v-for="s in sizeOptions"
              :key="s"
              type="button"
              class="size-btn"
              @click="chooseSize(s)"
            >
              {{ s }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div id="productDeleteModal" class="modal-container">
        <div class="modal__header">
          <span class="modal__title">ÜRÜN SİL</span>
          <button class="modal__close" @click="closeModal">
            <svg viewBox="0 0 16 16" width="16" height="16">
               <path fill="currentColor" d="M14.53 1.47a.75.75 0 0 0-1.06 0L8 6.94 2.53 1.47a.75.75 0 0 0-1.06 1.06L6.94 8l-5.47 5.47a.75.75 0 1 0 1.06 1.06L8 9.06l5.47 5.47a.75.75 0 0 0 1.06-1.06L9.06 8l5.47-5.47a.75.75 0 0 0 0-1.06z"></path>
            </svg>
          </button>
        </div>
        <div class="modal__inner">
          <span class="modal__text">BU İŞLEMLE ÜRÜN SEPETİNİZDEN KALDIRILACAKTIR.<br>ONAYLIYOR MUSUNUZ?</span>
          <div class="modal__footer">
            <button class="btn-modal btn-black" @click="confirmDelete(true)">
              SİL VE FAVORİLERE EKLE
            </button>
            <button class="btn-modal btn-white" @click="confirmDelete(false)">
              SİL
            </button>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&family=Mulish:wght@400;500;600;700;800&display=swap');

.shopping-cart-page {
    background-color: #fff;
    padding-bottom: 0px;
    font-family: 'Libre Franklin', 'Mulish', 'Open Sans', sans-serif;
    color: #22242a;
}

.mt-4 { margin-top: 1.5rem; }
.mt-3 { margin-top: 1rem; }

/* --- الأزرار --- */
.button {
    display: inline-flex;
    text-decoration: none;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;
    transition: all 0.3s ease;
}
.button--big {
    height: 40px;
    font-size: 14px;
}
.button--fluid {
    width: 100%;
}
.button--black {
    background-color: #22242a;
    color: #fff;
    border: 1px solid #22242a;
}
.button--black:hover {
    background-color: #fff;
    color: #22242a;
}

.custom-checkbox {
    line-height: 10px;
    position: relative;
    display: flex;
    align-items: center;
}

.custom-checkbox input {
    padding: 0 !important;
    height: 0 !important;
    width: 0 !important;
    visibility: hidden;
    margin-bottom: 0;
    cursor: pointer;
    position: absolute;
    border: none !important;
}

.custom-checkbox label {
    position: relative;
    margin-bottom: 0 !important;
    padding-left: 20px;
    width: 100%;
    font-size: 10px; 
    color: #393741;
    line-height: 12px;
    text-transform: none;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
}

.custom-checkbox label:before {
    content: "";
    background: #f8f8f9;
    border: 1px solid #c7c6cb;
    width: 12px;
    height: 12px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 0;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
}

.custom-checkbox input:checked ~ label:before {
    border: 1px solid #908e97;
}

.custom-checkbox input:checked ~ label:after {
    content: "";
    background-color: #161c2b;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 18'%3E%3Cpath d='M7 11.25l-4-4.5-3 3.376L7 18 20 3.374 17 0z' fill='%23fff'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 10px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 14px;
    height: 14px;
    border-radius: 0;
    border-color: #161c2b;
}

.gift-icon-wrapper {
  display: inline-flex;
  margin-right: 5px;
  vertical-align: middle;
}

.container.shopping__container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 20px 15px;
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.shopping-left {
    flex: 1;
    width: 100%;
}

.shopping-right {
    width: 350px;
    flex-shrink: 0;
    margin-top: 100px; 
}

/* --- Empty State --- */
.shopping__empty {
    padding: 60px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.shopping__empty--icon { margin-bottom: 2px; }
.shopping__empty--title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: -10px;
    text-transform: uppercase;
}
.shopping__empty--info {
    font-size: 15px;
    line-height: 2.9;
    margin-bottom: 60px;
    max-width: 2000px;
}

/* --- Header --- */
.shopping__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}
.shopping__header--title {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 700;
    text-transform: uppercase;
    gap: 10px;
}
.back-arrow {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.shopping__header--favorite {
    background: #F4F4F5; 
    border: none;
    padding: 0 4px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14.5px;
    font-weight: 500;
    cursor: pointer;
    color: #22242a;
    transition: all 0.3s ease;
}

.shopping__header--favorite svg {
    color: #22242a !important; 
    transition: none; 
}
.shopping__header--favorite:hover {
    color: #585562; 
}

/* --- Free Shipping Banner --- */
.free-shipping-banner {
    background-color: #f2f8f2;
    color: #333;
    padding: 9px 15px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    border-radius: 4px;
}
.circle-progress {
    height: 20px;
    width: 20px;
    min-width: 20px;
    min-height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    position: relative;
    background: conic-gradient(#439641 360deg, #fff6f6 0deg);
}
.circle-progress:before {
    content: "";
    position: absolute;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: #f2f8f2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* --- Product Cards --- */
.shopping-list-container {
    border: 1px solid #e9e8ea;
    background: #fff;
}

.shopping__card--item {
    margin-bottom: -8px;
    border: none;
    padding: 30px 20px;
    position: relative;
}

.shopping__card--item::after {
    content: "";
    display: block;
    height: 1px;
    background-color: #e9e8ea; 
    width: 95%; 
    margin: 0 auto; 
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.shopping__card--item:last-child::after {
    display: none;
}

.shopping-product-card {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.item-select {
    padding-top:50px;
}

.shopping-product-card__image {
    width: 100px;
    flex-shrink: 0;
    display: flex;             
    flex-direction: column;     
    align-items: center;
    cursor: pointer;
}

.shopping-product-card__image img {
    width: 100%;
    height: auto;
    background-color: #f5f5f5;
}

.shopping-product-card__info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.shopping-product-card__info--title-block {
    display: flex;
    flex-direction: column; 
    align-items: flex-start;
    margin-bottom: 7px;
}

.product-title {
    font-size: 12px;
    font-weight: 400;
    margin: 0 0 5px 0;
    line-height: 1.4;
    max-width: 95%;
    transition: color 0.2s ease;
}

.interactive-text {
  cursor: pointer;
}

.item-price-block {
    margin-top: 3px;
}

.shopping-product-card__info--price-new {
    font-size: 12px;
    font-weight: 600;
    color: #000;
}

.shopping-product-card__info--size {
    display: flex;
    align-items: center;
    margin-top: 15px;
    font-size: 12px;
    font-weight: 700;
    gap: 10px;
    text-transform: uppercase;
}
.edit-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: #22242a;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
}

.shopping-product-card__info--controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
}

.qty-selector {
    display: flex;
    align-items: center;
    font-size: 10px;
    color: #22242a;
    gap: 2px;
}
.qty-val {
    color: #000;
    font-weight: 600;
}
.qty-buttons button, .minus-icon, .delete-icon {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0 1px;
    display: flex;
    align-items: center;
    color: #22242a;
    transition: color 0.2s ease;
}

.minus-icon:hover, 
.delete-icon:hover,
.qty-buttons button:hover,
.edit-btn:hover,
.product-title:hover {
  color: #585562;
}

.delivery-estimate {
    font-size: 9px;
    font-weight: 400;
    color: #22242a;
    margin-top: 20px;
    white-space: nowrap;
}

/* --- Summary Box --- */
.shopping__summary-final {
    border: 1px solid #e9e8ea;
    padding: 16px;
    margin-bottom: 20px;
    background: #fff;
}

.shopping__summary-final--item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 300;
    margin-bottom: 20px;
}
.shopping__summary-final--item .f-bold {
    font-weight: 300;
    font-size: 14px;
}
.shopping__summary-final--item.discount {
    color: #0aca6e;
}
.shopping__summary-final--item.discount .f-bold {
    color: #0aca6e;
}

.totalAmount {
    border-top: 1px solid #e9e8ea;
    padding-top: 16px;
    margin-top: 16px;
}
.totalAmount .title {
    font-size: 14px;
    font-weight: 600;
}
.totalAmount .amount {
    font-size: 16px;
    font-weight: 600;
}

.shopping__coupon {
    border: 1px solid #e9e8ea;
    padding: 15px;
    background: #fff; 
}

.coupon-header {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    font-weight: 300;
    color: #666;
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
    align-items: center;
}
.btn-link {
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;
    color: #000;
    font-size: 12.5px;
}

.gift-package {
    padding: 10px 15px; 
    background: #F8F8F9; 
}

.gift-text {
  font-size: 11.5px; 
  font-weight: 400;
  vertical-align: middle;
}

/* --- CSS النافذة المنبثقة (Modal) المحسن --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  width: 450px; 
  max-width: 95%;
  padding: 20px 20px 30px 20px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.modal__title {
  font-size: 16px;
  font-weight: 700;
  color: #22242a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #000;
}

.modal__inner {
  padding: 0 1px;
}

.modal__text {
  font-size: 14px;
  font-weight: 400; 
  color: #22242a;
  margin-top: 20px;
  margin-bottom: 25px;
  display: block;
  line-height: 1.5;
}

.modal__footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* التنسيق الأساسي لأزرار المودال */
.btn-modal {
  width: 100%;
  height: 35px; /* ارتفاع الزر */
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #22242a; 
  transition: all 0.3s ease;
}

/* الزر الأسود (الأول) */
.btn-black {
  background-color: #22242a;
  color: #fff;
}
/* تأثير العكس عند المرور بالماوس: خلفية بيضاء ونص أسود */
.btn-black:hover {
  background-color: #fff;
  color: #22242a;
}

/* الزر الأبيض (الثاني) */
.btn-white {
  background-color: #fff;
  color: #22242a;
}
/* تأثير العكس عند المرور بالماوس: خلفية سوداء ونص أبيض */
.btn-white:hover {
  background-color: #22242a;
  color: #fff;
}

h1, h3 {
  text-transform: uppercase;
}

.size-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1200;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.size-panel {
  width: 520px;
  max-width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 18px 18px 22px;
}

.size-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.size-title {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #111;
}

.size-close {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.size-btn {
  height: 44px;
  border: 1px solid #111;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
}

.size-btn:hover {
  background: #f3f4f6;
}

.size-fade-enter-active,
.size-fade-leave-active {
  transition: opacity 0.2s ease;
}

.size-fade-enter-from,
.size-fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .size-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
    .shopping__container { flex-direction: column; }
    .shopping-right { 
      width: 100%; 
      margin-top: 20px; 
    }
}
@media(max-width: 767.98px) {
    .modal-container {
        width: 100%;
        margin: 0 10px;
    }
}
</style>
