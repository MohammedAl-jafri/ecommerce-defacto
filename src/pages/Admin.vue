<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

// form fields
const title = ref('')
const price = ref('')
const category = ref('')
const image = ref('')
const desc = ref('')

// to show existing products
const products = ref([])
const loading = ref(false)
const message = ref('')

// load current products (optional but nice)
const loadProducts = async () => {
  const snap = await getDocs(collection(db, 'products'))
  products.value = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }))
}

onMounted(loadProducts)

// submit handler
const addProduct = async () => {
  // basic validation
  if (!title.value || !price.value) {
    message.value = 'Name and price are required.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    await addDoc(collection(db, 'products'), {
      // keep both name and title to be safe
      name: title.value,
      title: title.value,
      price: Number(price.value),
      category: category.value,
      image: image.value,
      description: desc.value,
      createdAt: new Date()
    })
    message.value = 'Product added ✅'
    // clear form
    title.value = ''
    price.value = ''
    category.value = ''
    image.value = ''
    desc.value = ''
    // refresh list
    await loadProducts()
  } catch (err) {
    console.error(err)
    message.value = 'Error adding product ❌'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section style="max-width:900px;margin:0 auto;display:grid;gap:16px">
    <h1>Admin • Ürün Ekle</h1>

    <div
      style="background:white;padding:16px;border-radius:12px;display:grid;gap:12px;border:1px solid #eee"
    >
      <label>
        Ürün Adı
        <input v-model="title" placeholder="Örn: Basic T-Shirt" class="btn" />
      </label>

      <label>
        Fiyat
        <input v-model="price" type="number" min="0" step="0.01" class="btn" />
      </label>

      <label>
        Kategori
        <select v-model="category" class="btn">
          <option value="">(boş)</option>
          <option value="clothing">clothing</option>
          <option value="tshirt">tshirt</option>
          <option value="jeans">jeans</option>
          <option value="shoes">shoes</option>
        </select>
      </label>

      <label>
        Görsel URL
        <input v-model="image" placeholder="https://..." class="btn" />
      </label>

      <label>
        Açıklama
        <textarea v-model="desc" rows="3" class="btn"></textarea>
      </label>

      <button
        @click="addProduct"
        :disabled="loading"
        style="background:#ff8400;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer"
      >
        {{ loading ? 'Kaydediliyor…' : 'Ürün Ekle' }}
      </button>

      <p v-if="message">{{ message }}</p>
    </div>

    <div>
      <h2>Mevcut Ürünler (Firestore’dan)</h2>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <div
          v-for="p in products"
          :key="p.id"
          style="background:white;border:1px solid #eee;padding:8px 12px;border-radius:8px;min-width:150px"
        >
          <strong>{{ p.title || p.name }}</strong>
          <div style="font-size:12px;color:#666">{{ p.category }}</div>
          <div style="font-weight:bold">{{ p.price }} ₺</div>
        </div>
      </div>
    </div>
  </section>
</template>
