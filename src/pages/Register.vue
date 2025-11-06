<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

const register = () => {
  if (!name.value || !email.value || !password.value) {
    message.value = 'Tüm alanlar zorunlu.'
    return
  }
  // Part-3: burada Firebase Auth (createUserWithEmailAndPassword) gelecek
  message.value = 'Demo mod: Kayıt burada yapılacak.'
}
</script>

<template>
  <section style="max-width:420px;margin:0 auto">
    <h2>Kayıt Ol</h2>
    <p class="muted">Bu sayfa vize sonrası Firebase Auth ile bağlanacak.</p>

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
        Ad Soyad
        <input v-model="name" class="btn" style="width:100%" placeholder="Adınız" />
      </label>

      <label>
        E-posta
        <input v-model="email" type="email" class="btn" style="width:100%" placeholder="mail@ornek.com" />
      </label>

      <label>
        Şifre
        <input v-model="password" type="password" class="btn" style="width:100%" />
      </label>

      <button
        @click="register"
        style="background:#0f172a;color:white;border:none;padding:8px 0;border-radius:8px;cursor:pointer"
      >
        Kayıt Ol
      </button>

      <p v-if="message" class="muted">{{ message }}</p>
    </div>
  </section>
</template>

<style scoped>
.muted {
  color: #94a3b8;
}
</style>
