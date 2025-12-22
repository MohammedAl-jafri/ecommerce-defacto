<script setup>
const props = defineProps({
  deliveryTab: { type: String, required: true }, // 'address' | 'store'
  savedAddresses: { type: Array, default: () => [] },
  selectedAddressId: { type: String, default: null },
  openMenuId: { type: String, default: null },
  useSameAddress: { type: Boolean, default: true },
  storeSearch: {
    type: Object,
    default: () => ({ phone: '', city: '', district: '' }),
  },
})

const emit = defineEmits([
  'update:deliveryTab',
  'select-address',
  'toggle-menu',
  'edit-address',
  'open-delete',
  'open-address-modal',
  'update:useSameAddress',
  'update:storeSearch',
])

const setDeliveryTab = (val) => emit('update:deliveryTab', val)

const onStoreInput = (key, value) => {
  emit('update:storeSearch', { ...props.storeSearch, [key]: value })
}

const onSameAddressChange = (val) => emit('update:useSameAddress', val)

// اختيار العنوان (نستخدمها في الكرت كامل)
const selectAddr = (id) => emit('select-address', id)

// فتح/إغلاق القائمة (مع منع اختيار العنوان بالخطأ)
const toggleMenu = (id) => emit('toggle-menu', id)

const editAddr = (addr) => emit('edit-address', addr)
const delAddr = (id) => emit('open-delete', id)
</script>

<template>
  <div class="checkout-box checkout-box--panel">
    <div class="delivery-tabs delivery-tabs--inbox">
      <div
        class="tab-box"
        :class="{ active: deliveryTab === 'address', inactive: deliveryTab !== 'address' }"
        @click="setDeliveryTab('address')"
      >
        <div :class="deliveryTab === 'address' ? 'tab-header' : 'tab-header-inactive'">
          <strong>ADRESE TESLİMAT</strong>
        </div>
        <div class="tab-sub">
          <span class="tag-black">ÜCRETSİZ</span>
          <span class="date-range">• 23 ARALIK - 27 ARALIK</span>
        </div>
      </div>

      <div
        class="tab-box"
        :class="{ active: deliveryTab === 'store', inactive: deliveryTab !== 'store' }"
        @click="setDeliveryTab('store')"
      >
        <div :class="deliveryTab === 'store' ? 'tab-header' : 'tab-header-inactive'">
          <strong>MAĞAZADAN TESLİM</strong>
        </div>
        <div class="tab-sub">
          <span class="tag-black">ÜCRETSİZ</span>
          <span class="date-range">• 23 ARALIK - 27 ARALIK</span>
        </div>
      </div>
    </div>

    <div class="panel-divider"></div>

    <!-- ADDRESS TAB -->
    <div v-if="deliveryTab === 'address'">
      <div class="checkout-box__title">TESLİMAT ADRESLERİM</div>

      <div class="checkout-box__content">
        <div class="address-grid">
          <div
            v-for="addr in savedAddresses"
            :key="addr.id"
            class="addr-card"
            :class="{ selected: selectedAddressId === addr.id }"
            @click="selectAddr(addr.id)"
          >
            <div class="card-top">
              <div class="card-top-left">
                <div class="radio-circle" @click.stop="selectAddr(addr.id)">
                  <div class="dot" v-if="selectedAddressId === addr.id"></div>
                </div>

                <div class="addr-title">
                  {{ addr.addressTitle || addr.district || 'ADRES' }}
                </div>
              </div>

              <!-- مهم: لازم wrapper يكون relative عشان dropdown يطلع صح -->
              <div class="dots-menu-wrapper" style="position: relative;">
                <div class="dots-menu" @click.stop="toggleMenu(addr.id)">
                  <svg viewBox="0 0 2 9" width="4" height="18" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M2 1.167a1 1 0 1 1-2 0 1 1 0 1 1 2 0M2 4.5a1 1 0 1 1-2 0 1 1 0 1 1 2 0M1 8.833a1 1 0 1 0 0-2 1 1 0 1 0 0 2"
                    ></path>
                  </svg>
                </div>

                <div v-if="openMenuId === addr.id" class="menu-dropdown" @click.stop>
                  <div class="menu-item" @click="editAddr(addr)">
                    <svg
                      class="menu-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    DÜZENLE
                  </div>

                  <div class="menu-item menu-item-delete" @click="delAddr(addr.id)">
                    <svg
                      class="menu-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    SİL
                  </div>
                </div>
              </div>
            </div>

            <div class="addr-text">
              {{ addr.addressDetails }}<br />
              {{ addr.neighborhood }} {{ addr.district }} / {{ addr.city }}
            </div>

            <div class="addr-name">{{ addr.firstName }} {{ addr.lastName }}</div>
          </div>

          <div class="addr-card-new" @click="emit('open-address-modal')">
            <div class="plus-icon">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
                <path d="M8.805 0v8.805H0v2.391h8.805V20h2.391v-8.805H20v-2.39h-8.805V0z"></path>
              </svg>
            </div>
            <div class="new-text">YENİ ADRES EKLE</div>
          </div>
        </div>

        <div class="fatura-section">
          <div class="fatura-title">FATURA ADRESLERİM</div>

          <label class="custom-checkbox-container">
            <input
              type="checkbox"
              :checked="useSameAddress"
              @change="onSameAddressChange($event.target.checked)"
            />
            <span class="checkmark">
              <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 18">
                <path d="M7 11.25l-4-4.5-3 3.376L7 18 20 3.374 17 0z" fill="#fff" />
              </svg>
            </span>
            <span class="checkbox-label">Fatura adresi olarak da ekle</span>
          </label>

          <div class="fatura-info">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style="min-width:16px;">
              <path
                d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"
              ></path>
            </svg>
            <span>FATURANIZ KAYITLI E-MAIL ADRESİNİZE GÖNDERİLECEKTİR.</span>
          </div>
        </div>
      </div>

      <div class="checkout-box__sub-info">
        <span class="truck-icon">
          <slot name="truckIcon" />
        </span>
        <span>
          Tahmini teslimat, bulunduğunuz adrese göre 16 Aralık - 20 Aralık günleri arasında yapılacaktır.
          (Pazar günleri ve resmi tatiller hariçtir).
        </span>
      </div>
    </div>

    <!-- STORE TAB -->
    <div v-else class="store-pickup-content">
      <div class="store-form">
        <div class="store-field">
          <label>CEP TELEFONU NUMARASI</label>
          <input
            type="text"
            :value="storeSearch.phone"
            @input="onStoreInput('phone', $event.target.value)"
            placeholder="0(___) ___ __ __"
            class="store-input"
          />
        </div>

        <label class="store-label-title">TESLİMAT MAĞAZANIZI BULUN</label>

        <div class="store-search-row">
          <div class="store-select-wrapper">
            <select
              class="store-select"
              :value="storeSearch.city"
              @change="onStoreInput('city', $event.target.value)"
            >
              <option value="">İL</option>
              <option value="ISTANBUL">İSTANBUL</option>
              <option value="ANKARA">ANKARA</option>
            </select>
          </div>

          <div class="store-select-wrapper">
            <select
              class="store-select"
              :value="storeSearch.district"
              @change="onStoreInput('district', $event.target.value)"
            >
              <option value="">İLÇE</option>
              <option value="KADIKOY">KADIKÖY</option>
            </select>
          </div>

          <button class="store-search-btn" type="button">ARA</button>
        </div>

        <div class="fatura-section mt-4">
          <div class="fatura-title">FATURA ADRESLERİM</div>

          <label class="custom-checkbox-container">
            <input type="checkbox" />
            <span class="checkmark">
              <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 18">
                <path d="M7 11.25l-4-4.5-3 3.376L7 18 20 3.374 17 0z" fill="#fff" />
              </svg>
            </span>
            <span class="checkbox-label" style="font-size: 13px; color:#555;">Fatura adresi ekle</span>
          </label>
        </div>

        <ul class="store-rules">
          <li>● MAĞAZADAN TESLİM AL YÖNTEMİYLE VERMİŞ OLDUĞUNUZ SİPARİŞLERİNİZ 24 SAATTE KARGODA HİZMETİ KAPSAMI DIŞINDADIR...</li>
          <li>● SİPARİŞİNİZİ TESLİM ALMAK İÇİN SMS İLE İLETTİĞİMİZ KISA KODU KASADA PAYLAŞMANIZ YETERLİDİR.</li>
          <li>● SİPARİŞİNİZİN MAĞAZADA BEKLEME SÜRESİ, SİPARİŞİN MAĞAZAYA TESLİMİNİ TAKİP EDEN 10 GÜNDÜR.</li>
        </ul>

        <div class="store-warning">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"
            ></path>
          </svg>
          <span>MAĞAZADAN TESLİM AL YÖNTEMİYLE VERMİŞ OLDUĞUNUZ SİPARİŞLERİNİZ 24 SAATTE KARGODA HİZMETİ KAPSAMI DIŞINDADIR.</span>
        </div>
      </div>
    </div>
  </div>
</template>
