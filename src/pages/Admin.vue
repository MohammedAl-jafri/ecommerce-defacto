<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
const deleteProduct = async (id) => {
  if (!confirm('Bu ürünü silmek istiyor musun?')) return
  await deleteDoc(doc(db, 'products', id))
  await loadProducts() // refresh list
}
const editingId = ref(null)
const startEdit = (product) => {
  editingId.value = product.id
  title.value = product.title || product.name || ''
  price.value = product.price || ''
  category.value = product.category || ''
  image.value = product.image || ''
  desc.value = product.description || ''
  message.value = 'Editing mode'
}



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
  if (!title.value || !price.value) {
    message.value = 'Name and price are required.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    if (editingId.value) {
      // UPDATE
      await updateDoc(doc(db, 'products', editingId.value), {
        name: title.value,
        title: title.value,
        price: Number(price.value),
        category: category.value,
        image: image.value,
        description: desc.value
      })
      message.value = 'Product updated ✅'
    } else {
      // CREATE
      await addDoc(collection(db, 'products'), {
        name: title.value,
        title: title.value,
        price: Number(price.value),
        category: category.value,
        image: image.value,
        description: desc.value,
        createdAt: new Date()
      })
      message.value = 'Product added ✅'
    }

    // clear
    editingId.value = null
    title.value = ''
    price.value = ''
    category.value = ''
    image.value = ''
    desc.value = ''

    await loadProducts()
  } catch (err) {
    console.error(err)
    message.value = 'Error saving product ❌'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <section
  style="max-width: 650px; margin: 0 auto; display: grid; gap: 16px; padding: 16px 0;"
>

    <h1>Admin • Ürün Ekle</h1>

    <div
      style="background:white;padding:16px;border-radius:12px;display:grid;gap:12px;border:1px solid #eee"
    >
      <label>
        Ürün Adı
        <input v-model="title" placeholder="Örn: Basic T-Shirt" class="btn" style="width:100%" />
...
<input v-model="price" type="number" min="0" step="0.01" class="btn" style="width:100%" />
...
<input v-model="image" placeholder="https://..." class="btn" style="width:100%" />
<textarea v-model="desc" rows="3" class="btn" style="width:100%"></textarea>

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
      <div v-if="image" style="margin-top:8px">
  <p style="font-size:12px;color:#666">Önizleme:</p>
  <img :src="image" alt="preview" style="max-width:180px;border-radius:8px;border:1px solid #eee" />
</div>

      <label>
        Açıklama
        <textarea v-model="desc" rows="3" class="btn"></textarea>
      </label>

      <button
  @click="addProduct"
  :disabled="loading"
  style="background:#ff8400;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer"
>
  {{ editingId ? 'Ürünü Güncelle' : (loading ? 'Kaydediliyor…' : 'Ürün Ekle') }}
</button>


      <p v-if="message">{{ message }}</p>
    </div>

    <div>
      <h2>Mevcut Ürünler (Firestore’dan)</h2>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <div
  v-for="p in products"
  :key="p.id"
  style="background:white;border:1px solid #ddd;padding:10px 12px;border-radius:10px;min-width:160px;display:grid;gap:6px"
>
  <strong>{{ p.title || p.name }}</strong>
  <div style="font-size:12px;color:#666">{{ p.category }}</div>
  <div style="font-weight:bold">{{ p.price }} ₺</div>

  <div style="display:flex;gap:6px">
    <button
      @click="() => startEdit(p)"
      style="flex:1;background:#e5f1ff;border:none;border-radius:6px;padding:4px 0;font-size:12px;cursor:pointer"
    >
      Edit
    </button>
    <button
      @click="deleteProduct(p.id)"
      style="flex:1;background:#ffe5e5;border:none;border-radius:6px;padding:4px 0;font-size:12px;cursor:pointer"
    >
      Delete
    </button>
  </div>
</div>


      </div>
    </div>
  </section>
</template>
