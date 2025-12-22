<script setup>
const props = defineProps({
  loading: { type: Boolean, default: false },
  editing: { type: Boolean, default: false },
  form: {
    type: Object,
    required: true,
    default: () => ({
      firstName: '',
      lastName: '',
      country: 'TÜRKİYE',
      city: '',
      district: '',
      neighborhood: '',
      addressDetails: '',
      phone: '',
      addressTitle: '',
      type: 'BİREYSEL',
    }),
  },
})

const emit = defineEmits(['close', 'save', 'update:form'])

const update = (key, val) => {
  emit('update:form', { ...props.form, [key]: val })
}
</script>

<template>
  <div class="modal-overlay-side" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="emit('close')">✕</button>

      <h2 class="modal-title">
        {{ editing ? 'TESLİMAT ADRESİ DÜZENLE' : 'TESLİMAT ADRESİ EKLE' }}
      </h2>

      <div class="modal-form">
        <div class="form-row">
          <div class="form-field">
            <label class="field-label">AD*</label>
            <input
              :value="form.firstName"
              @input="update('firstName', $event.target.value)"
              type="text"
              class="field-input"
            />
          </div>

          <div class="form-field">
            <label class="field-label">SOYAD*</label>
            <input
              :value="form.lastName"
              @input="update('lastName', $event.target.value)"
              type="text"
              class="field-input"
            />
          </div>
        </div>

        <div class="form-field">
          <label class="field-label">ÜLKE*</label>
          <select
            :value="form.country"
            @change="update('country', $event.target.value)"
            class="field-select"
          >
            <option value="TÜRKİYE">TÜRKİYE</option>
          </select>
        </div>

        <div class="form-field">
          <label class="field-label">ŞEHİR*</label>
          <select
            :value="form.city"
            @change="update('city', $event.target.value)"
            class="field-select"
          >
            <option value="">SEÇİNİZ</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <option value="Bursa">Bursa</option>
            <option value="Antalya">Antalya</option>
          </select>
        </div>

        <div class="form-field">
          <label class="field-label">İLÇE*</label>
          <select
            :value="form.district"
            @change="update('district', $event.target.value)"
            class="field-select"
          >
            <option value="">SEÇİNİZ</option>
            <option value="Kadıköy">Kadıköy</option>
            <option value="Beşiktaş">Beşiktaş</option>
            <option value="Şişli">Şişli</option>
          </select>
        </div>

        <div class="form-field">
          <label class="field-label">MAHALLE*</label>
          <select
            :value="form.neighborhood"
            @change="update('neighborhood', $event.target.value)"
            class="field-select"
          >
            <option value="">SEÇİNİZ</option>
            <option value="Moda">Moda</option>
            <option value="Fenerbahçe">Fenerbahçe</option>
            <option value="Caferağa">Caferağa</option>
          </select>
        </div>

        <div class="form-field">
          <label class="field-label">ADRES TARİFİ*</label>
          <textarea
            :value="form.addressDetails"
            @input="update('addressDetails', $event.target.value)"
            class="field-textarea"
            rows="3"
            placeholder="LÜTFEN BURAYA ADRESİNİZİN TARİFİNİ GİRİNİZ."
          ></textarea>
        </div>

        <div class="form-field">
          <label class="field-label">CEP TELEFONU*</label>
          <input
            :value="form.phone"
            @input="update('phone', $event.target.value)"
            type="text"
            class="field-input"
            placeholder="0(___) ___ __ __"
          />
        </div>

        <div class="form-field">
          <label class="field-label">ADRES BAŞLIĞI (Opsiyonel)</label>
          <input
            :value="form.addressTitle"
            @input="update('addressTitle', $event.target.value)"
            type="text"
            class="field-input"
            placeholder="Örn: Ev, İş, vb."
          />
        </div>

        <div class="form-field">
          <label class="field-label">ADRES TİPİ</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                :checked="form.type === 'BİREYSEL'"
                @change="update('type', 'BİREYSEL')"
                type="radio"
                value="BİREYSEL"
                class="radio-input"
              />
              <span>BİREYSEL</span>
            </label>
            <label class="radio-label">
              <input
                :checked="form.type === 'KURUMSAL'"
                @change="update('type', 'KURUMSAL')"
                type="radio"
                value="KURUMSAL"
                class="radio-input"
              />
              <span>KURUMSAL</span>
            </label>
          </div>
        </div>

        <button class="modal-save-btn" @click="emit('save')" :disabled="loading">
          {{ loading ? 'KAYDEDİLİYOR...' : (editing ? 'GÜNCELLE' : 'YENİ ADRES EKLE') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay-side {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.modal-content {
  background: #fff;
  width: 100%;
  max-width: 520px;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px 10px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #22242a;
  text-transform: uppercase;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-input,
.field-select,
.field-textarea {
  width: 100%;
  border: none;
  border-bottom: 1px solid #d1d5db;
  padding: 10px 0;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: transparent;
}

.field-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0 center;
  padding-right: 20px;
}

.field-textarea { resize: vertical; min-height: 80px; }

.radio-group { display: flex; gap: 20px; margin-top: 5px; }
.radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }
.radio-input { cursor: pointer; width: 18px; height: 18px; }

.modal-save-btn {
  width: 100%;
  height: 48px;
  background: #22242a;
  color: #fff;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 14px;
  margin-top: 10px;
}
</style>
