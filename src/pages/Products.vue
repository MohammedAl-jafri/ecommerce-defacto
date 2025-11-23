<!-- src/pages/Products.vue -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const router = useRouter()

// كل المنتجات من Firestore
const all = ref([])

// الـ query params من الـ URL
const q = ref(route.query.q || '')
// cat هنا = mainCategory (women / men / kids / accessory)
const cat = ref(route.query.cat || '')
const sort = ref(route.query.sort || '')

// فتح صفحة التفاصيل
const goToDetail = (product) => {
  router.push(`/product/${product.id}`)
}

// تحديث الـ URL لما يتغيّر أي فلتر
const applyQueryToUrl = () => {
  router.replace({
    name: 'products',
    query: {
      q: q.value || undefined,
      cat: cat.value || undefined,
      sort: sort.value || undefined,
    },
  })
}

watch([q, cat, sort], applyQueryToUrl)

// لو تغيّر الـ URL من مكان ثاني (مثلاً من /home) نزامن القيم
watch(
  () => route.query,
  (nv) => {
    q.value = nv.q || ''
    cat.value = nv.cat || ''
    sort.value = nv.sort || ''
  }
)

// 🔥 قراءة المنتجات من Firestore
onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'products'))

  all.value = snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      title: data.title || data.name || 'Ürün',
      price: data.price || 0,

      // sub category (tshirt, jeans, shoes...) لو حاب تستعمله لاحقاً
      category: data.category || '',

      // 👇 الحقل الجديد اللي أضفناه في Firestore
      mainCategory: data.mainCategory || '', // women / men / kids / accessory

      // تنظيف رابط الصورة
      image: (data.image || '')
        .toString()
        .trim()
        .replace(/^image:\s*/i, ''),

      ...data,
    }
  })
})

// الفلترة + البحث + الترتيب
const filtered = computed(() => {
  let items = all.value

  // فلتر حسب mainCategory لو تم اختيارها
  if (cat.value) {
    items = items.filter((i) => i.mainCategory === cat.value)
  }

  // البحث في عنوان المنتج
  if (q.value) {
    const term = q.value.toLowerCase()
    items = items.filter((i) =>
      (i.title || '').toLowerCase().includes(term),
    )
  }

  // الترتيب بالسعر
  if (sort.value === 'price-asc') {
    items = [...items].sort((a, b) => a.price - b.price)
  } else if (sort.value === 'price-desc') {
    items = [...items].sort((a, b) => b.price - a.price)
  }

  return items
})
</script>

<template>
  <section class="products-page">
    <header class="products-header">
      <h1>Ürünler</h1>
      <p>Tüm ürünleri listele, filtrele ve fiyatlara göre sırala.</p>
    </header>

    <!-- سطر الفلاتر -->
    <div class="filters">
      <!-- بحث -->
      <input
        v-model="q"
        placeholder="Ürün ara…"
        class="filter-input"
      />

      <!-- الفئة الرئيسية (women / men / kids / accessory) -->
      <select v-model="cat" class="filter-select">
        <option value="">Kategori: Hepsi</option>
        <option value="women">Kadın</option>
        <option value="men">Erkek</option>
        <option value="kids">Çocuk &amp; Bebek</option>
        <option value="accessory">Aksesuar</option>
      </select>

      <!-- الترتيب -->
      <select v-model="sort" class="filter-select">
        <option value="">Sırala</option>
        <option value="price-asc">Fiyat Artan</option>
        <option value="price-desc">Fiyat Azalan</option>
      </select>
    </div>

    <!-- شبكة المنتجات -->
    <div class="grid" v-if="filtered.length">
      <ProductCard
        v-for="p in filtered"
        :key="p.id"
        :item="p"
        @detail="goToDetail"
      />
    </div>

    <p v-else class="empty-text">
      Filtrelere uygun ürün bulunamadı.
    </p>
  </section>
</template>

<style scoped>
.products-page {
  padding: 30px 0 50px;
  background: #fafafa;
}

/* العنوان */
.products-header {
  text-align: center;
  margin-bottom: 20px;
}

.products-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.products-header p {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

/* سطر الفلاتر */
.filters {
  max-width: 1100px;
  margin: 0 auto 18px;
  padding: 0 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-input,
.filter-select {
  min-height: 36px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  font-size: 14px;
  background: #ffffff;
  color: #111827;
}

.filter-input {
  flex: 1;
}

.filter-select {
  min-width: 160px;
}

/* شبكة المنتجات */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 22px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
}

/* في حالة لا يوجد منتجات */
.empty-text {
  text-align: center;
  margin-top: 30px;
  color: #6b7280;
}
</style>
