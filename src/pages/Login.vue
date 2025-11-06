<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const message = ref('')

const login = () => {
  // Part-3: burada Firebase Auth çağrısı yapılacak
  if (!email.value || !password.value) {
    message.value = 'E-posta ve şifre gerekli.'
    return
  }
  message.value = 'Demo mod: Giriş işlemi burada olacak.'
}
</script>

<template>
  <section style="max-width:420px;margin:0 auto">
    <h2>Giriş</h2>
    <p class="muted">Part-1/2: sadece arayüz. Part-3'te gerçek Firebase Auth eklenecek.</p>

    <div
      style="
        background:white;
        margin-top:16px;
        padding:16px;
        border-radius:12px;
        border:1px solid #e5e7eb;
        display:grid;
        gap:12px;
      "
    >
      <label>
        E-posta
        <input
          v-model="email"
          type="email"
          placeholder="ornek@mail.com"
          class="btn"
          style="width:100%"
        />
      </label>

      <label>
        Şifre
        <input
          v-model="password"
          type="password"
          class="btn"
          style="width:100%"
        />
      </label>

      <button
        @click="login"
        style="background:#0f172a;color:white;border:none;padding:8px 0;border-radius:8px;cursor:pointer"
      >
        Giriş Yap
      </button>

      <p v-if="message" class="muted">{{ message }}</p>

      <p class="muted" style="font-size:12px">
        İpucu: Admin sayfasını korumak için buraya Firebase Auth bağlanacak.
      </p>
    </div>
  </section>
</template>

<style scoped>
.muted {
  color: #94a3b8;
}
</style>
