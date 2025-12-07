<!-- src/pages/Products.vue -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const router = useRouter()

const all = ref([])

const q = ref(route.query.q || '')
const cat = ref(route.query.cat || '')
const sort = ref(route.query.sort || '')

// 🔹 حالة فتح / غلق لوحة الفلاتر
const isFiltersOpen = ref(false)

// 🔹 قيم مؤقّتة داخل الـ panel (تُطبق فقط مع UYGULA)
const tempCat = ref('')
const tempSort = ref('')

const goToDetail = (product) => {
  const pid = product.productId || product.id
  router.push(`/product/${pid}`)
}

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

watch(
  () => route.query,
  (nv) => {
    q.value = nv.q || ''
    cat.value = nv.cat || ''
    sort.value = nv.sort || ''
  }
)

onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'products'))

  all.value = snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      productId: data.productId || null,
      title: data.title || data.name || 'Ürün',
      price: data.price || 0,
      category: data.category || '',
      mainCategory: data.mainCategory || '', // women / men / kids / accessory
      image: (data.image || '')
        .toString()
        .trim()
        .replace(/^image:\s*/i, ''),
      ...data,
    }
  })
})

const filtered = computed(() => {
  let items = all.value

  if (cat.value) {
    items = items.filter((i) => i.mainCategory === cat.value)
  }

  if (q.value) {
    const term = q.value.toLowerCase()
    items = items.filter((i) =>
      (i.title || '').toLowerCase().includes(term),
    )
  }

  if (sort.value === 'price-asc') {
    items = [...items].sort((a, b) => a.price - b.price) // Artan
  } else if (sort.value === 'price-desc') {
    items = [...items].sort((a, b) => b.price - a.price) // Azalan
  }

  return items
})

// 🔹 العنوان الرئيسي
const pageTitle = computed(() => {
  const map = {
    women: 'KADIN',
    men: 'ERKEK',
    kids: 'ÇOCUK & BEBEK',
    accessory: 'AKSESUAR',
  }
  return map[cat.value] || 'ÜRÜNLER'
})

// 🔹 اسم الكاتيجوري والـ sort لعرضهما كنص صغير
const catLabel = computed(() => {
  const map = {
    '': 'HEPSİ',
    women: 'KADIN',
    men: 'ERKEK',
    kids: 'ÇOCUK & BEBEK',
    accessory: 'AKSESUAR',
  }
  return map[cat.value] || 'HEPSİ'
})

const sortLabel = computed(() => {
  const map = {
    '': 'ÖNERİLEN',
    newest: 'YENİ GELENLER',
    bestseller: 'ÇOK SATANLAR',
    'price-desc': 'FİYAT (AZALAN)',
    'price-asc': 'FİYAT (ARTAN)',
    'top-rated': 'EN ÇOK DEĞERLENDİRİLENLER',
    favorite: 'EN FAVORİLER',
  }
  return map[sort.value] || 'ÖNERİLEN'
})


// نص ملخص أعلى الشبكة: KADIN • FİYAT (AZALAN)
const selectedInfo = computed(() => {
  const parts = []
  if (catLabel.value) parts.push(catLabel.value)
  if (sortLabel.value) parts.push(sortLabel.value)
  return parts.join(' • ')
})

// 🔹 فتح لوحة الفلاتر
const openFilters = () => {
  tempCat.value = cat.value
  tempSort.value = sort.value
  isFiltersOpen.value = true
}

// 🔹 تطبيق الفلاتر من اللوحة (زر UYGULA فقط)
const applyFiltersFromPanel = () => {
  cat.value = tempCat.value
  sort.value = tempSort.value
  isFiltersOpen.value = false
}

// 🔹 تنظيف الفلاتر (زر FİLTRELERİ TEMİZLE)
const clearFilters = () => {
  cat.value = ''
  sort.value = ''

  tempCat.value = ''
  tempSort.value = ''
}
</script>

<template>
  <section class="products-page">
    <!-- عنوان الكاتيجوري مثل ERKEK DIŞ GİYİM -->
    <header class="products-header">
      <h1 class="products-title">TÜM ÜRÜNLER</h1>
    </header>

    <!-- صف علوي: ملخص مختصر + زر فلاتر على اليمين -->
    <div class="products-top-row">
      <div class="products-summary">
        {{ selectedInfo }}
      </div>

      <button
        type="button"
        class="filters-toggle"
        @click="openFilters"
      >
        FİLTRELER
      </button>
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

    <!-- 🔹 Overlay + Panel الفلاتر مثل DeFacto -->
    <transition name="filters-fade">
      <div
        v-if="isFiltersOpen"
        class="filters-overlay"
        @click.self="isFiltersOpen = false"
      >
        <aside class="filters-panel">
          <header class="filters-header">
            <button
              type="button"
              class="filters-clear"
              @click="clearFilters"
            >
              FİLTRELERİ TEMİZLE
            </button>

            <button
              type="button"
              class="filters-close"
              @click="isFiltersOpen = false"
            >
              ✕
            </button>
          </header>

          <div class="filters-body">
            <!-- SIRALA -->
<section class="filters-group">
  <h3 class="filters-group-title">SIRALA</h3>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value=""
      v-model="tempSort"
    />
    <span>ÖNERİLEN</span>
  </label>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value="newest"
      v-model="tempSort"
    />
    <span>YENİ GELENLER</span>
  </label>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value="bestseller"
      v-model="tempSort"
    />
    <span>ÇOK SATANLAR</span>
  </label>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value="price-desc"
      v-model="tempSort"
    />
    <span>FİYAT (AZALAN)</span>
  </label>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value="price-asc"
      v-model="tempSort"
    />
    <span>FİYAT (ARTAN)</span>
  </label>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value="top-rated"
      v-model="tempSort"
    />
    <span>EN ÇOK DEĞERLENDİRİLENLER</span>
  </label>

  <label class="filters-option filters-option--sort">
    <input
      type="radio"
      value="favorite"
      v-model="tempSort"
    />
    <span>EN FAVORİLER</span>
  </label>
</section>


            <!-- CİNSİYET -->
            <section class="filters-group">
              <h3 class="filters-group-title">CİNSİYET</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Erkek</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Erkek Bebek</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Erkek Çocuk - Genç Erkek</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kadın</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kız Bebek</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kız Çocuk - Genç Kız</span>
              </label>
            </section>

            <!-- KATEGORİ (كما كان عندك) -->
            <section class="filters-group">
              <h3 class="filters-group-title">KATEGORİ</h3>

              <label class="filters-option filters-option--cat">
                <input
                  type="radio"
                  value=""
                  v-model="tempCat"
                />
                <span>Hepsi</span>
              </label>

              <label class="filters-option filters-option--cat">
                <input
                  type="radio"
                  value="women"
                  v-model="tempCat"
                />
                <span>Kadın</span>
              </label>

              <label class="filters-option filters-option--cat">
                <input
                  type="radio"
                  value="men"
                  v-model="tempCat"
                />
                <span>Erkek</span>
              </label>

              <label class="filters-option filters-option--cat">
                <input
                  type="radio"
                  value="kids"
                  v-model="tempCat"
                />
                <span>Çocuk &amp; Bebek</span>
              </label>

              <label class="filters-option filters-option--cat">
                <input
                  type="radio"
                  value="accessory"
                  v-model="tempCat"
                />
                <span>Aksesuar</span>
              </label>
            </section>

            <!-- BEDEN -->
            <section class="filters-group">
              <h3 class="filters-group-title">BEDEN</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>36-40</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>75</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>XXS</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>1-3 Ay (62cm)</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>XS</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- RENK -->
            <section class="filters-group">
              <h3 class="filters-group-title">RENK</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Açık Pembe</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Altın</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Antrasit</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Bej</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Beyaz</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- FİYAT (سلايدر شكلي فقط) -->
            <section class="filters-group">
              <h3 class="filters-group-title">FİYAT</h3>

              <div class="filters-price">
                <div class="filters-price-slider">
                  <div class="filters-price-track"></div>
                  <div
                    class="filters-price-thumb filters-price-thumb--left"
                  ></div>
                  <div
                    class="filters-price-thumb filters-price-thumb--right"
                  ></div>
                </div>
                <div class="filters-price-values">
                  <span>29</span>
                  <span>6999</span>
                </div>
              </div>
            </section>

            <!-- YAKA -->
            <section class="filters-group">
              <h3 class="filters-group-title">YAKA</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Açık Omuz</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Apaş Yaka</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Askılı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Balıkçı Yaka</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Bebe Yaka</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- KALIP -->
            <section class="filters-group">
              <h3 class="filters-group-title">KALIP</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>A Kesim</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Baggy</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Boyfriend</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Crop</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Culotte</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- KOL BOYU -->
            <section class="filters-group">
              <h3 class="filters-group-title">KOL BOYU</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Askılı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kısa Kol</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kolsuz</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Uzun Kol</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Yarasa Kol</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- ÜRÜN YÜKSEKLİĞİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">ÜRÜN YÜKSEKLİĞİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kısa</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Uzun</span>
              </label>
            </section>

            <!-- LİSANS BİLGİSİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">LİSANS BİLGİSİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Avengers</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Barbie</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Batman</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Cars</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Diğer</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- AYAKKABI TİPİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">AYAKKABI TİPİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Ev Terliği</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Panduf</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Sneaker</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Terlik</span>
              </label>
            </section>

            <!-- ÜRÜN BOYU -->
            <section class="filters-group">
              <h3 class="filters-group-title">ÜRÜN BOYU</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Maxi</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Midi</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Mini</span>
              </label>
            </section>

            <!-- KUMAŞ -->
            <section class="filters-group">
              <h3 class="filters-group-title">KUMAŞ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Bambu</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Brode</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Dalgıç Kumaşı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Dantel</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Deri</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- DESEN -->
            <section class="filters-group">
              <h3 class="filters-group-title">DESEN</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>3D</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Baskılı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Çizgili</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Etnik Desenli</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Floral</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- MALZEME -->
            <section class="filters-group">
              <h3 class="filters-group-title">MALZEME</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>100% Pamuk</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Geri Dönüşümlü</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Keten İçerikli</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Modal</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Pamuk Elastan</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- TAKIM İÇERİĞİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">TAKIM İÇERİĞİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>2'li</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>3'lü</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>4'lü</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>5'li</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>6'lı</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- ASTAR BİLGİSİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">ASTAR BİLGİSİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Diğer</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Full Astarli</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Pamuk Astar</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Peluş Astar</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Penye Astar</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- BEL DETAYI -->
            <section class="filters-group">
              <h3 class="filters-group-title">BEL DETAYI</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Diğer</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Düşük Bel</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Normal Bel</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Yüksek Bel</span>
              </label>
            </section>

            <!-- ÇORAP TİPİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">ÇORAP TİPİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Babet Çorap</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kısa Çorap</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Külotlu Çorap</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Pilates Çorabı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Sneaker Çorap</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- ÇANTA TİPİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">ÇANTA TİPİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Bel Çantası</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Cüzdan</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Çapraz Çanta</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Diğer</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>El Çantası</span>
              </label>

              <button type="button" class="filters-more">
                + DAHA FAZLA GÖSTER
              </button>
            </section>

            <!-- TOPUK BOYU -->
            <section class="filters-group">
              <h3 class="filters-group-title">TOPUK BOYU</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>1 cm</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>1,5 cm</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>2 cm</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>2,5 cm</span>
              </label>
            </section>

            <!-- KOKU ÇEŞİDİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">KOKU ÇEŞİDİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Aromatik</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Baharatlı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Odunsu</span>
              </label>
            </section>

            <!-- TAKI TİPİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">TAKI TİPİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Bileklik</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Kolye</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Küpe</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Yüzük</span>
              </label>
            </section>

            <!-- DANTEL DETAY -->
            <section class="filters-group">
              <h3 class="filters-group-title">DANTEL DETAY</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Dantel Detaylı</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Dantelli</span>
              </label>
            </section>

            <!-- SÜTYEN KAP DETAYI -->
            <section class="filters-group">
              <h3 class="filters-group-title">SÜTYEN KAP DETAYI</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Pedli</span>
              </label>
            </section>

            <!-- ŞAPKA TİPİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">ŞAPKA TİPİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Bucket Şapka</span>
              </label>
            </section>

            <!-- KEMER KATEGORİ -->
            <section class="filters-group">
              <h3 class="filters-group-title">KEMER KATEGORİ</h3>

              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Jean Kemeri</span>
              </label>
              <label class="filters-option filters-option--check">
                <input type="checkbox" />
                <span>Klasik Kemer</span>
              </label>
            </section>
          </div>

          <footer class="filters-footer">
            <button
              type="button"
              class="filters-apply"
              @click="applyFiltersFromPanel"
            >
              UYGULA
            </button>
          </footer>
        </aside>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.products-page {
  padding: 32px 0 64px;
  background: #ffffff;
}

.products-header {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}

.products-title {
  font-size: 14px;
  letter-spacing: 0.18em;
  font-weight: 400;
  color: #111111;
  text-transform: uppercase;
}

/* الصف العلوي: ملخص + زر فلاتر على اليمين */
.products-top-row {
  max-width: 1320px;
  margin: 12px auto 8px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.products-summary {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555555;
}

/* زر FİLTRELER */
.filters-toggle {
  border: none;
  background: none;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  color: #111111;
}

/* شبكة المنتجات مثل DeFacto تقريباً (4 كولمات) */
.grid {
  max-width: 1320px;
  margin: 24px auto 0;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 40px;
}

.empty-text {
  text-align: center;
  margin-top: 30px;
  color: #6b7280;
}

/* ======= OVERLAY + PANEL للفلاتر ======= */
.filters-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: flex-end;
  z-index: 40;
}

.filters-panel {
  width: 360px;
  max-width: 100%;
  background: #ffffff;
  padding: 24px 24px 16px;
  overflow-y: auto;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters-clear {
  background: none;
  border: none;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

.filters-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.filters-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filters-group-title {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* نفس النص لكل العناصر */
.filters-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px;
}

/* 🔘 SIRALA → دوائر منسّقة تمامًا */
.filters-option--sort input[type='radio'] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1px solid #c4c4c4;
  background: #ffffff;
  cursor: pointer;
  position: relative;
}

.filters-option--sort input[type='radio']:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #111111;
  transform: translate(-50%, -50%);
}

/* 🔳 KATEGORİ → راديو مربّع + صح */
.filters-option--cat input[type='radio'] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #c4c4c4;
  background: #ffffff;
  cursor: pointer;
  position: relative;
}

.filters-option--cat input[type='radio']:checked {
  background: #111111;
  border-color: #111111;
}

.filters-option--cat input[type='radio']:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 2px;
  width: 4px;
  height: 8px;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(45deg);
}

/* ✅ CHECKBOX عام لباقي الفلاتر */
.filters-option--check input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #c4c4c4;
  background: #ffffff;
  cursor: pointer;
  position: relative;
}

.filters-option--check input[type='checkbox']:checked {
  background: #111111;
  border-color: #111111;
}

.filters-option--check input[type='checkbox']:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 2px;
  width: 4px;
  height: 8px;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(45deg);
}

/* رابط + DAHA FAZLA GÖSTER */
.filters-more {
  margin-top: 4px;
  padding: 0;
  border: none;
  background: none;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

/* FİYAT – سلايدر شكلي */
.filters-price {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters-price-slider {
  position: relative;
  height: 24px;
}

.filters-price-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #111111;
  transform: translateY(-50%);
}

.filters-price-thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #111111;
  background: #ffffff;
  transform: translateY(-50%);
}

.filters-price-thumb--left {
  left: 10%;
}

.filters-price-thumb--right {
  right: 10%;
}

.filters-price-values {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

/* Footer للزر UYGULA */
.filters-footer {
  margin-top: 24px;
}

.filters-apply {
  width: 100%;
  padding: 10px 0;
  background: #111111;
  color: #ffffff;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

/* أنيميشين بسيطة للـ overlay */
.filters-fade-enter-active,
.filters-fade-leave-active {
  transition: opacity 0.2s ease;
}

.filters-fade-enter-from,
.filters-fade-leave-to {
  opacity: 0;
}

/* استجابة بسيطة للشاشات الصغيرة */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 8px;
    padding: 0 12px;
  }

  .filters-panel {
    width: 100%;
  }
}
</style>
