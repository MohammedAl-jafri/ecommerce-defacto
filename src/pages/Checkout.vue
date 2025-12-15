<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import useAuth from '../stores/useAuth'
import paymentLogosImg from '../assets/payment-icons.png'

const router = useRouter()
const { user } = useAuth()

// State
const step = ref(1) // 1: Address, 2: Payment
const items = ref([])
const loading = ref(false)
const showEarnings = ref(false)
const useSameAddress = ref(true)

// Saved Addresses
const savedAddresses = ref([])
const selectedAddressId = ref(null)

// Address Menu
const openMenuId = ref(null)

// Address Modal State
const showAddressModal = ref(false)
const editingAddressId = ref(null)
const addressForm = ref({
  firstName: '',
  lastName: '',
  country: 'TÜRKİYE',
  city: '',
  district: '',
  neighborhood: '',
  addressDetails: '',
  phone: '',
  addressTitle: '',
  type: 'BİREYSEL' // BİREYSEL or KURUMSAL
})

// Delete Confirmation
const showDeleteConfirm = ref(false)
const deleteAddressId = ref(null)

onMounted(async () => {
  if (!user.value) {
    router.push({
      name: 'login',
      query: { redirect: '/checkout' },
    })
    return
  }

  const saved = localStorage.getItem('cart')
  if (saved) {
    const parsed = JSON.parse(saved)
    items.value = parsed.map((i) => ({
      ...i,
      qty: i.qty || i.quantity || 1,
    }))
  }

  if (!items.value.length) {
    router.push('/cart')
  }

  // Load saved addresses
  await loadAddresses()
})

// Load Addresses from Firebase
const loadAddresses = async () => {
  try {
    const q = query(collection(db, 'addresses'), where('userId', '==', user.value.uid))
    const snapshot = await getDocs(q)
    savedAddresses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Auto-select first address
    if (savedAddresses.value.length > 0 && !selectedAddressId.value) {
      selectedAddressId.value = savedAddresses.value[0].id
    }
  } catch (err) {
    console.error('Error loading addresses:', err)
  }
}

// Calculations
const subTotal = computed(() =>
  items.value.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)
)

const shipping = 0
const discount = computed(() => Math.round(subTotal.value * 0.05)) // 5% discount
const earnings = computed(() => Math.round(subTotal.value * 0.07)) // 7% earnings
const total = computed(() => subTotal.value - discount.value)
const itemCount = computed(() => items.value.length)

// Open Address Modal
const openAddressModal = () => {
  editingAddressId.value = null
  showAddressModal.value = true
}

// Close Address Modal
const closeAddressModal = () => {
  showAddressModal.value = false
  editingAddressId.value = null
  // Reset form
  addressForm.value = {
    firstName: '',
    lastName: '',
    country: 'TÜRKİYE',
    city: '',
    district: '',
    neighborhood: '',
    addressDetails: '',
    phone: '',
    addressTitle: '',
    type: 'BİREYSEL'
  }
}

// Toggle Address Menu
const toggleMenu = (addressId) => {
  if (openMenuId.value === addressId) {
    openMenuId.value = null
  } else {
    openMenuId.value = addressId
  }
}

// Close menu when clicking outside
const closeMenu = () => {
  openMenuId.value = null
}

// Edit Address
const editAddress = (addr) => {
  editingAddressId.value = addr.id
  addressForm.value = {
    firstName: addr.firstName,
    lastName: addr.lastName,
    country: addr.country,
    city: addr.city,
    district: addr.district,
    neighborhood: addr.neighborhood,
    addressDetails: addr.addressDetails,
    phone: addr.phone,
    addressTitle: addr.addressTitle,
    type: addr.type
  }
  openMenuId.value = null
  showAddressModal.value = true
}

// Open Delete Confirmation
const openDeleteConfirm = (addressId) => {
  deleteAddressId.value = addressId
  openMenuId.value = null
  showDeleteConfirm.value = true
}

// Close Delete Confirmation
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deleteAddressId.value = null
}

// Delete Address
const deleteAddress = async () => {
  if (!deleteAddressId.value) return

  loading.value = true
  try {
    await deleteDoc(doc(db, 'addresses', deleteAddressId.value))
    
    // Reload addresses
    await loadAddresses()
    
    closeDeleteConfirm()
  } catch (err) {
    console.error('Error deleting address:', err)
    alert('Adres silinirken hata oluştu!')
  } finally {
    loading.value = false
  }
}

// Save Address
const saveAddress = async () => {
  // Validation
  if (!addressForm.value.firstName || !addressForm.value.lastName || !addressForm.value.addressDetails) {
    alert('Lütfen zorunlu alanları doldurun.')
    return
  }

  loading.value = true

  try {
    // Generate address title if not provided
    const title = addressForm.value.addressTitle || 
                 `${addressForm.value.district || addressForm.value.city || 'ADRES'}`.toUpperCase()

    const addressData = {
      userId: user.value.uid,
      ...addressForm.value,
      addressTitle: title,
    }

    if (editingAddressId.value) {
      // Update existing address
      await updateDoc(doc(db, 'addresses', editingAddressId.value), {
        ...addressData,
        updatedAt: serverTimestamp(),
      })
      alert('Adres başarıyla güncellendi!')
    } else {
      // Create new address
      await addDoc(collection(db, 'addresses'), {
        ...addressData,
        createdAt: serverTimestamp(),
      })
      alert('Adres başarıyla kaydedildi!')
    }

    closeAddressModal()
    
    // Reload addresses
    await loadAddresses()
  } catch (err) {
    console.error(err)
    alert('Adres kaydedilirken hata oluştu!')
  } finally {
    loading.value = false
  }
}

// Select Address
const selectAddress = (id) => {
  selectedAddressId.value = id
}

// Go to Payment
const goToPayment = () => {
  if (!selectedAddressId.value) {
    alert('Lütfen bir adres seçin.')
    return
  }
  step.value = 2
  window.scrollTo(0, 0)
}

// Place Order
const placeOrder = async () => {
  loading.value = true

  try {
    const selectedAddress = savedAddresses.value.find(a => a.id === selectedAddressId.value)
    
    const orderData = {
      userId: user.value.uid,
      userEmail: user.value.email,
      address: selectedAddress,
      items: items.value.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.qty || 1,
        image: i.image,
      })),
      total: total.value,
      createdAt: serverTimestamp(),
    }

    await addDoc(collection(db, 'orders'), orderData)

    // Clear cart
    localStorage.removeItem('cart')
    items.value = []

    // Go to profile
    router.push('/profile')
  } catch (err) {
    console.error(err)
    alert('Sipariş oluşturulurken hata oluştu!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <header class="checkout-header">
      <div class="header__container">
        <div class="header__content">
        <RouterLink to="/" class="logo-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="logo-svg" viewBox="0 0 177.6 36.43">
            <path fill="#211e1f" d="M6.91,36.46H1.13a2.23,2.23,0,0,1-.34,0l-.39,0V.8H.61L3.55.69C4.93.63,6.37.57,7.77.57a27.16,27.16,0,0,1,6.53.67,17.84,17.84,0,0,1-3.68,35.18c-1.1,0-2.28,0-3.71,0Zm.22-2.66H9.84a15.33,15.33,0,0,0,15.38-14c.67-8-5.53-15.56-13.28-16.28-1.54-.14-3.09-.16-4.27-.16H3.08V33.81Z" transform="translate(-0.4 -0.57)"/>
            <path fill="#211e1f" d="M14.25,1.45C9.8.36,5.21.91.62,1V36.16a4.07,4.07,0,0,0,.51.07c3.16,0,6.33.07,9.48,0A17.72,17.72,0,0,0,27.52,21.37,17.58,17.58,0,0,0,14.25,1.45ZM25.43,19.8A15.61,15.61,0,0,1,9.59,34c-2.22,0-4.44,0-6.72,0V3.26c.09,0,.14-.11.19-.11,3,0,6-.13,8.9.14C20,4,26.11,11.8,25.43,19.8Z" transform="translate(-0.4 -0.57)"/>
            <path fill="#211e1f" d="M44.68,37a14,14,0,1,1-.07-28.06,13.59,13.59,0,0,1,2.7.27A13.85,13.85,0,0,1,58.57,24.13l0,.19H33.44c.12,4,3.65,8.27,8,9.56a10.94,10.94,0,0,0,3.19.46c2.23,0,7.76-.73,10.84-7.48l.09-.19,2.3,1-.07.19A14.08,14.08,0,0,1,44.68,37ZM55.89,21.58a11.34,11.34,0,0,0-11.28-9.95h-.22c-5.6.11-10.66,4.73-11,9.95Z" transform="translate(-0.4 -0.57)"/>
            <path fill="#211e1f" d="M47.27,9.42a13.81,13.81,0,1,0,10.3,18.33l-1.92-.81c-3.25,7.12-9.72,8.5-14.29,7.14s-8.13-5.75-8.13-10H58.36A13.64,13.64,0,0,0,47.27,9.42ZM33.21,21.79c.17-5.45,5.41-10.26,11.18-10.37A11.52,11.52,0,0,1,56.12,21.79Z" transform="translate(-0.4 -0.57)"/>
            <polygon fill="#211e1f" points="61.36 35.82 61.36 0.17 79.91 0.17 79.91 2.7 64.03 2.7 64.03 15.55 78.88 15.55 78.88 18.16 63.96 18.16 63.96 35.82 61.36 35.82"/>
            <polygon fill="#211e1f" points="61.57 35.61 63.75 35.61 63.75 17.95 78.67 17.95 78.67 15.76 63.82 15.76 63.82 2.49 79.7 2.49 79.7 0.38 61.57 0.38 61.57 35.61"/>
            <path fill="#211e1f" d="M95.1,37l-.84,0a13.5,13.5,0,0,1-9.55-4.53,14,14,0,0,1,.69-19.65,14.26,14.26,0,0,1,21,1.83V9.69l0,0V9H109V36.38h-2.57v-.8h0V31.25C103.32,35.1,99.61,37,95.1,37Zm0-25.34A11.37,11.37,0,1,0,103.12,15a11.37,11.37,0,0,0-8.05-3.34v0Z" transform="translate(-0.4 -0.57)"/>
            <path fill="#211e1f" d="M137.55,18.31l-.07-.19A14.15,14.15,0,0,0,124.3,9a15.12,15.12,0,0,0-2.32.19A14.15,14.15,0,0,0,110.32,23.1a14.24,14.24,0,0,0,12,13.77,15.75,15.75,0,0,0,1.93.12,14.2,14.2,0,0,0,13.23-9.17l.06-.19-2.29-1-.08.18c-3,6.76-8.62,7.49-10.88,7.49A11.35,11.35,0,0,1,121,12.15a10.63,10.63,0,0,1,3.38-.55,11,11,0,0,1,3.18.48,11.78,11.78,0,0,1,7.56,7l1.62.31Z" transform="translate(-0.4 -0.57)"/>
            <path fill="#211e1f" d="M164,37a14,14,0,1,1,14-14A14,14,0,0,1,164,37Zm0-25.4A11.41,11.41,0,1,0,175.42,23,11.42,11.42,0,0,0,164,11.58Z" transform="translate(-0.4 -0.57)"/>
            <path fill="#211e1f" d="M147.75,37c-.27,0-.5,0-.72-.05l-.17,0a6.79,6.79,0,0,1-3-.92,5.35,5.35,0,0,1-2.07-2.3,8.62,8.62,0,0,1-.64-4.19V12.18l-4.59,0V9.56h4.51V.75h2.75V9.52h6.57v2.62l-6.57,0V29.52a7.92,7.92,0,0,0,.4,2.82,3.13,3.13,0,0,0,1.19,1.53,4.42,4.42,0,0,0,2,.65c.13,0,.45,0,.8,0h.35v2.35l-.18,0A4.89,4.89,0,0,1,147.75,37Z" transform="translate(-0.4 -0.57)"/>
          </svg>
        </RouterLink>  

          <div class="ssl-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="73" height="38" viewBox="0 0 73 38" fill="none" class="ssl-svg">
              <g clip-path="url(#clip0_614_139968)">
                <path d="M23.0002 16.4431C23.0086 15.1784 22.5239 14.7249 21.3878 14.8079C21.2641 14.8171 21.1398 14.8092 20.998 14.8092C20.998 13.5161 21.0084 12.2776 20.996 11.0392C20.9596 7.46129 18.1187 4.56452 14.5776 4.51911C12.5071 4.49213 10.4353 4.49476 8.36415 4.52043C5.53625 4.55465 3.01091 6.51764 2.26197 9.2749C2.09474 9.89019 2.02447 10.5463 2.00299 11.1866C1.96265 12.3783 1.99128 13.5727 1.99128 14.8092C1.71539 14.8092 1.48829 14.8079 1.2612 14.8092C0.434825 14.8151 0.00211475 15.2507 0.00146406 16.095C-0.000488019 21.4799 -0.000488019 26.8655 0.00146406 32.2504C0.00146406 33.0762 0.429619 33.4994 1.25274 33.4994C8.08436 33.5 14.916 33.5 21.7476 33.4994C22.5486 33.4994 22.9761 33.0743 22.9852 32.2695C22.9911 31.7647 22.9865 31.2607 22.9865 30.7559C22.9865 25.985 22.9676 21.2141 22.9995 16.4431H23.0002ZM18.9639 14.5328C18.9646 14.6078 18.9574 14.6828 18.9522 14.7881H4.07154C4.05267 14.7486 4.0351 14.7289 4.0351 14.7098C4.04291 13.3503 3.97914 11.9854 4.07805 10.6331C4.24267 8.38652 6.16352 6.60516 8.38107 6.5762C10.4522 6.54922 12.524 6.55054 14.5952 6.57555C16.8153 6.60187 18.7433 8.38258 18.9106 10.62C19.0075 11.9183 18.9516 13.2279 18.9633 14.5328H18.9639Z" fill="#0ACA6E"/>
                <path d="M7.60517 23.5547L10.1718 25.9638L16.7107 19.8265C16.9471 19.6047 17.3302 19.6047 17.5665 19.8265C17.8028 20.0483 17.8028 20.4079 17.5664 20.6297L10.172 27.5692L6.74955 24.3579C6.5132 24.1361 6.51317 23.7765 6.74948 23.5547C6.98577 23.3329 7.36888 23.3329 7.60517 23.5547Z" fill="white" stroke="white"/>
              </g>
              <path d="M39.678 21.168C38.908 21.168 38.173 21.105 37.473 20.979C36.773 20.839 36.115 20.636 35.499 20.37C34.897 20.104 34.365 19.782 33.903 19.404L34.806 17.43C35.562 17.99 36.332 18.396 37.116 18.648C37.9 18.9 38.761 19.026 39.699 19.026C40.735 19.026 41.533 18.844 42.093 18.48C42.667 18.116 42.954 17.605 42.954 16.947C42.954 16.555 42.828 16.233 42.576 15.981C42.324 15.715 41.946 15.491 41.442 15.309C40.938 15.127 40.315 14.952 39.573 14.784C38.691 14.616 37.914 14.413 37.242 14.175C36.57 13.923 36.01 13.629 35.562 13.293C35.114 12.957 34.771 12.558 34.533 12.096C34.309 11.62 34.197 11.06 34.197 10.416C34.197 9.534 34.435 8.75 34.911 8.064C35.387 7.378 36.052 6.846 36.906 6.468C37.774 6.076 38.789 5.88 39.951 5.88C40.651 5.88 41.33 5.95 41.988 6.09C42.66 6.23 43.276 6.433 43.836 6.699C44.396 6.951 44.879 7.266 45.285 7.644L44.361 9.618C43.689 9.072 42.989 8.673 42.261 8.421C41.533 8.155 40.77 8.022 39.972 8.022C39.006 8.022 38.243 8.218 37.683 8.61C37.123 9.002 36.843 9.548 36.843 10.248C36.843 10.654 36.955 10.99 37.179 11.256C37.417 11.522 37.774 11.746 38.25 11.928C38.74 12.11 39.363 12.292 40.119 12.474C40.987 12.656 41.757 12.866 42.429 13.104C43.115 13.342 43.696 13.629 44.172 13.965C44.648 14.287 45.005 14.679 45.243 15.141C45.495 15.589 45.621 16.128 45.621 16.758C45.621 17.654 45.383 18.438 44.907 19.11C44.431 19.768 43.745 20.279 42.849 20.643C41.967 20.993 40.91 21.168 39.678 21.168ZM53.2132 21.168C52.4432 21.168 51.7082 21.105 51.0082 20.979C50.3082 20.839 49.6502 20.636 49.0342 20.37C48.4322 20.104 47.9002 19.782 47.4382 19.404L48.3412 17.43C49.0972 17.99 49.8672 18.396 50.6512 18.648C51.4352 18.9 52.2962 19.026 53.2342 19.026C54.2702 19.026 55.0682 18.844 55.6282 18.48C56.2022 18.116 56.4892 17.605 56.4892 16.947C56.4892 16.555 56.3632 16.233 56.1112 15.981C55.8592 15.715 55.4812 15.491 54.9772 15.309C54.4732 15.127 53.8502 14.952 53.1082 14.784C52.2262 14.616 51.4492 14.413 50.7772 14.175C50.1052 13.923 49.5452 13.629 49.0972 13.293C48.6492 12.957 48.3062 12.558 48.0682 12.096C47.8442 11.62 47.7322 11.06 47.7322 10.416C47.7322 9.534 47.9702 8.75 48.4462 8.064C48.9222 7.378 49.5872 6.846 50.4412 6.468C51.3092 6.076 52.3242 5.88 53.4862 5.88C54.1862 5.88 54.8652 5.95 55.5232 6.09C56.1952 6.23 56.8112 6.433 57.3712 6.699C57.9312 6.951 58.4142 7.266 58.8202 7.644L57.8962 9.618C57.2242 9.072 56.5242 8.673 55.7962 8.421C55.0682 8.155 54.3052 8.022 53.5072 8.022C52.5412 8.022 51.7782 8.218 51.2182 8.61C50.6582 9.002 50.3782 9.548 50.3782 10.248C50.3782 10.654 50.4902 10.99 50.7142 11.256C50.9522 11.522 51.3092 11.746 51.7852 11.928C52.2752 12.11 52.8982 12.292 53.6542 12.474C54.5222 12.656 55.2922 12.866 55.9642 13.104C56.6502 13.342 57.2312 13.629 57.7072 13.965C58.1832 14.287 58.5402 14.679 58.7782 15.141C59.0302 15.589 59.1562 16.128 59.1562 16.758C59.1562 17.654 58.9182 18.438 58.4422 19.11C57.9662 19.768 57.2802 20.279 56.3842 20.643C55.5022 20.993 54.4452 21.168 53.2132 21.168ZM61.6873 21V6.048H64.3963V18.774H71.3683V21H61.6873ZM35.739 35.077C34.793 35.077 34.0413 34.8387 33.484 34.362L33.803 33.636C34.0963 33.8633 34.4007 34.032 34.716 34.142C35.0387 34.2447 35.3907 34.296 35.772 34.296C36.168 34.296 36.4687 34.23 36.674 34.098C36.8867 33.9587 36.993 33.7607 36.993 33.504C36.993 33.2987 36.9197 33.1373 36.773 33.02C36.6337 32.8953 36.399 32.7927 36.069 32.712L35.145 32.492C34.6683 32.3893 34.3017 32.206 34.045 31.942C33.7957 31.678 33.671 31.359 33.671 30.985C33.671 30.6623 33.759 30.3763 33.935 30.127C34.1183 29.8777 34.3713 29.6833 34.694 29.544C35.0167 29.3973 35.398 29.324 35.838 29.324C36.2267 29.324 36.5933 29.3863 36.938 29.511C37.29 29.6357 37.587 29.8153 37.829 30.05L37.51 30.765C37.246 30.545 36.9747 30.3837 36.696 30.281C36.4173 30.171 36.1277 30.116 35.827 30.116C35.453 30.116 35.1597 30.1893 34.947 30.336C34.7417 30.4827 34.639 30.6807 34.639 30.93C34.639 31.1427 34.705 31.3113 34.837 31.436C34.969 31.5607 35.178 31.6597 35.464 31.733L36.399 31.964C36.927 32.074 37.3157 32.2573 37.565 32.514C37.8143 32.7633 37.939 33.086 37.939 33.482C37.939 33.966 37.741 34.3547 37.345 34.648C36.949 34.934 36.4137 35.077 35.739 35.077ZM43.8798 34.351C43.6378 34.5783 43.3261 34.758 42.9448 34.89C42.5634 35.0147 42.1748 35.077 41.7788 35.077C41.1994 35.077 40.7008 34.9633 40.2828 34.736C39.8648 34.5087 39.5421 34.1823 39.3148 33.757C39.0874 33.3243 38.9738 32.811 38.9738 32.217C38.9738 31.645 39.0838 31.1427 39.3038 30.71C39.5311 30.2773 39.8428 29.94 40.2388 29.698C40.6348 29.4487 41.0894 29.324 41.6028 29.324C42.1014 29.324 42.5268 29.434 42.8788 29.654C43.2381 29.874 43.5094 30.1893 43.6928 30.6C43.8834 31.0033 43.9788 31.4873 43.9788 32.052V32.228H39.8538V31.612H43.4068L43.0988 32.008C43.1134 31.3847 42.9924 30.908 42.7358 30.578C42.4791 30.248 42.1051 30.083 41.6138 30.083C41.1004 30.083 40.6971 30.2663 40.4038 30.633C40.1178 30.9923 39.9748 31.4983 39.9748 32.151C39.9748 32.855 40.1288 33.3867 40.4368 33.746C40.7448 34.098 41.1994 34.274 41.8008 34.274C42.1234 34.274 42.4314 34.2227 42.7248 34.12C43.0181 34.01 43.2968 33.8487 43.5608 33.636L43.8798 34.351ZM47.6629 35.077C47.1056 35.077 46.6252 34.9597 46.2219 34.725C45.8259 34.4903 45.5179 34.1603 45.2979 33.735C45.0779 33.3097 44.9679 32.8073 44.9679 32.228C44.9679 31.656 45.0779 31.15 45.2979 30.71C45.5252 30.27 45.8442 29.929 46.2549 29.687C46.6656 29.445 47.1496 29.324 47.7069 29.324C48.0882 29.324 48.4549 29.39 48.8069 29.522C49.1589 29.6467 49.4486 29.8227 49.6759 30.05L49.3569 30.776C49.0929 30.5707 48.8289 30.4167 48.5649 30.314C48.3082 30.204 48.0406 30.149 47.7619 30.149C47.2266 30.149 46.7976 30.3287 46.4749 30.688C46.1596 31.0473 46.0019 31.5607 46.0019 32.228C46.0019 32.8807 46.1596 33.383 46.4749 33.735C46.7902 34.087 47.2229 34.263 47.7729 34.263C48.0369 34.263 48.3009 34.2117 48.5649 34.109C48.8289 34.0063 49.0929 33.8487 49.3569 33.636L49.6759 34.362C49.4412 34.582 49.1442 34.758 48.7849 34.89C48.4256 35.0147 48.0516 35.077 47.6629 35.077ZM52.7347 35.077C52.0674 35.077 51.565 34.8937 51.2277 34.527C50.8977 34.153 50.7327 33.603 50.7327 32.877V29.467H51.7337V32.866C51.7337 33.3427 51.829 33.6947 52.0197 33.922C52.2177 34.142 52.5184 34.252 52.9217 34.252C53.391 34.252 53.7687 34.1017 54.0547 33.801C54.3407 33.493 54.4837 33.086 54.4837 32.58V29.467H55.4957V35H54.5167V33.812L54.6487 33.757C54.502 34.1897 54.2564 34.5197 53.9117 34.747C53.567 34.967 53.1747 35.077 52.7347 35.077ZM57.1573 35V31.018C57.1573 30.7613 57.15 30.5047 57.1353 30.248C57.128 29.984 57.106 29.7237 57.0693 29.467H58.0153L58.1363 30.842L58.0153 30.798C58.1106 30.314 58.327 29.951 58.6643 29.709C59.009 29.4597 59.394 29.335 59.8193 29.335C59.922 29.335 60.0136 29.3423 60.0943 29.357C60.1823 29.3643 60.263 29.379 60.3363 29.401L60.3253 30.314C60.142 30.248 59.9366 30.215 59.7093 30.215C59.3353 30.215 59.0346 30.2957 58.8073 30.457C58.58 30.6183 58.415 30.8237 58.3123 31.073C58.2096 31.3223 58.1583 31.59 58.1583 31.876V35H57.1573ZM65.6864 34.351C65.4444 34.5783 65.1327 34.758 64.7514 34.89C64.3701 35.0147 63.9814 35.077 63.5854 35.077C63.0061 35.077 62.5074 34.9633 62.0894 34.736C61.6714 34.5087 61.3487 34.1823 61.1214 33.757C60.8941 33.3243 60.7804 32.811 60.7804 32.217C60.7804 31.645 60.8904 31.1427 61.1104 30.71C61.3377 30.2773 61.6494 29.94 62.0454 29.698C62.4414 29.4487 62.8961 29.324 63.4094 29.324C63.9081 29.324 64.3334 29.434 64.6854 29.654C65.0447 29.874 65.3161 30.1893 65.4994 30.6C65.6901 31.0033 65.7854 31.4873 65.7854 32.052V32.228H61.6604V31.612H65.2134L64.9054 32.008C64.9201 31.3847 64.7991 30.908 64.5424 30.578C64.2857 30.248 63.9117 30.083 63.4204 30.083C62.9071 30.083 62.5037 30.2663 62.2104 30.633C61.9244 30.9923 61.7814 31.4983 61.7814 32.151C61.7814 32.855 61.9354 33.3867 62.2434 33.746C62.5514 34.098 63.0061 34.274 63.6074 34.274C63.9301 34.274 64.2381 34.2227 64.5314 34.12C64.8247 34.01 65.1034 33.8487 65.3674 33.636L65.6864 34.351ZM72.0766 35H71.0866V33.537L71.2186 33.669C71.0939 34.1163 70.8556 34.4647 70.5036 34.714C70.1516 34.956 69.7262 35.077 69.2276 35.077C68.7509 35.077 68.3256 34.9597 67.9516 34.725C67.5849 34.483 67.2952 34.1457 67.0826 33.713C66.8772 33.273 66.7746 32.7633 66.7746 32.184C66.7746 31.6047 66.8772 31.1023 67.0826 30.677C67.2879 30.2443 67.5739 29.9107 67.9406 29.676C68.3146 29.4413 68.7436 29.324 69.2276 29.324C69.7262 29.324 70.1516 29.4487 70.5036 29.698C70.8556 29.9473 71.0939 30.292 71.2186 30.732L71.0756 30.864V26.904H72.0766V35ZM69.4476 34.263C69.9682 34.263 70.3716 34.087 70.6576 33.735C70.9436 33.3757 71.0866 32.866 71.0866 32.206C71.0866 31.5533 70.9436 31.0473 70.6576 30.688C70.3789 30.3287 69.9756 30.149 69.4476 30.149C68.9269 30.149 68.5199 30.3287 68.2266 30.688C67.9332 31.04 67.7866 31.5387 67.7866 32.184C67.7866 32.844 67.9332 33.3573 68.2266 33.724C68.5199 34.0833 68.9269 34.263 69.4476 34.263Z" fill="#0ACA6E"/>
                <defs>
                  <clipPath id="clip0_614_139968">
                    <rect width="23" height="29" fill="white" transform="translate(0 4.5)"/>
                  </clipPath>
                </defs>
              </svg>
            <span class="ssl-text">GÜVENLİ ALIŞVERİŞ</span>
          </div>
        </div>
      </div>
    </header>

    <div class="content-wrapper">
      <div class="top-section">
        <div class="main-title">TESLİMAT YÖNTEMİ</div>
        <div class="summary-header">
          <span class="summary-title">SİPARİŞ ÖZETİ</span>
          <RouterLink
            to="/cart" class="product-count">
            {{ itemCount }} ÜRÜN
            <svg viewBox="0 0 20 16" width="12" height="10" style="margin-left: 5px;">
              <path fill="currentColor" d="M11.861 0a.698.686 0 0 1 .494.202l7.44 7.313h.002a.698.686 0 0 1 .15.223.698.686 0 0 1 .053.261.698.686 0 0 1-.053.263.698.686 0 0 1-.15.223h-.002l-7.439 7.314a.698.686 0 0 1-.988 0 .698.686 0 0 1 0-.969l6.253-6.146H.699A.698.686 0 0 1 0 7.999a.698.686 0 0 1 .699-.685h16.918l-6.25-6.143a.698.686 0 0 1 0-.969.698.686 0 0 1 .494-.202"></path>
            </svg>
          </RouterLink>
        </div>
      </div>

      <div class="stepper-row">
        <div class="step" :class="{ active: step === 1 }" @click="step = 1">
          <span class="step-num" :class="{ inactive: step === 2 }">1</span>
          <span class="step-text" :class="{ muted: step === 2 }">ADRES BİLGİLERİM</span>
        </div>
        <div class="step" :class="{ active: step === 2 }">
          <span class="step-num" :class="{ inactive: step === 1 }">2</span>
          <span class="step-text" :class="{ muted: step === 1 }">ÖDEME SEÇENEKLERİM</span>
        </div>
      </div>

<div class="checkout">
  <div class="checkout__process">
    <div v-if="step === 1">

      <!-- ✅ ONE CONTAINER LIKE ORIGINAL -->
      <div class="checkout-box checkout-box--panel">

        <!-- tabs INSIDE the same box -->
        <div class="delivery-tabs delivery-tabs--inbox">
          <div class="tab-box active">
            <div class="tab-header"><strong>ADRESE TESLİMAT</strong></div>
            <div class="tab-sub">
              <span class="tag-black">ÜCRETSİZ</span>
              <span class="date-range">• 16 ARALIK - 20 ARALIK</span>
            </div>
          </div>

          <div class="tab-box inactive">
            <div class="tab-header-inactive"><strong>MAĞAZADAN TESLİM</strong></div>
            <div class="tab-sub">
              <span class="tag-black">ÜCRETSİZ</span>
              <span class="date-range">• 16 ARALIK - 20 ARALIK</span>
            </div>
          </div>
        </div>

        <!-- line divider inside box -->
        <div class="panel-divider"></div>

        <!-- title inside same box -->
        <div class="checkout-box__title">TESLİMAT ADRESLERİM</div>

        <div class="checkout-box__content">
          <div class="address-grid">
            <div
              v-for="addr in savedAddresses"
              :key="addr.id"
              class="addr-card"
              :class="{ selected: selectedAddressId === addr.id }"
            >
              <div class="card-top">
                <div class="card-top-left">
                  <div class="radio-circle" @click="selectAddress(addr.id)">
                    <div class="dot" v-if="selectedAddressId === addr.id"></div>
                  </div>

                  <div class="addr-title">
                    {{ addr.addressTitle || addr.district || 'ADRES' }}
                  </div>
                </div>

                <div class="dots-menu-wrapper">
                  <div class="dots-menu" @click="toggleMenu(addr.id)">
                    <svg viewBox="0 0 2 9" width="4" height="18" fill="currentColor">
                      <path fill-rule="evenodd" d="M2 1.167a1 1 0 1 1-2 0 1 1 0 1 1 2 0M2 4.5a1 1 0 1 1-2 0 1 1 0 1 1 2 0M1 8.833a1 1 0 1 0 0-2 1 1 0 1 0 0 2"></path>
                    </svg>
                  </div>

                  <div v-if="openMenuId === addr.id" class="menu-dropdown" @click.stop>
                    <div class="menu-item" @click="editAddress(addr)">
                      <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      DÜZENLE
                    </div>

                    <div class="menu-item menu-item-delete" @click="openDeleteConfirm(addr.id)">
                      <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

            <div class="addr-card-new" @click="openAddressModal">
              <div class="plus-icon">
                <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
                  <path d="M8.805 0v8.805H0v2.391h8.805V20h2.391v-8.805H20v-2.39h-8.805V0z"></path>
                </svg>
              </div>
              <div class="new-text">YENİ ADRES EKLE</div>
            </div>
          </div>

          <!-- ✅ FATURA STILL INSIDE SAME BOX -->
          <div class="fatura-section">
            <div class="fatura-title">FATURA ADRESLERİM</div>

            <label class="custom-checkbox-container">
              <input type="checkbox" v-model="useSameAddress" />
              <span class="checkmark">
                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 18">
                  <path d="M7 11.25l-4-4.5-3 3.376L7 18 20 3.374 17 0z" fill="#fff" />
                </svg>
              </span>
              <span class="checkbox-label">Fatura adresi olarak da ekle</span>
            </label>

            <div class="fatura-info">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style="min-width:16px;">
                <path d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path>
              </svg>
              <span>FATURANIZ KAYITLI E-MAIL ADRESİNİZE GÖNDERİLECEKTİR.</span>
            </div>
          </div>
        </div>
              <div class="checkout-box__sub-info">
                <span class="truck-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="14" viewBox="0 0 23 14" fill="none">
                    <g clip-path="url(#clip0_614_145320)">
                    <path d="M22.2579 11.0353V9.60026C22.0686 9.58378 21.8911 9.57944 21.7189 9.55168C21.1502 9.46058 20.7581 9.06581 20.7509 8.52441C20.7338 7.3349 20.6229 7.38175 21.846 7.39303C21.9469 7.3939 22.0479 7.38001 22.1849 7.37047C22.02 6.9115 21.7009 6.646 21.2601 6.63819C19.8108 6.6113 18.3606 6.62778 16.8923 6.62778C16.8707 6.78829 16.8896 6.9488 16.8211 7.06159C16.7499 7.17959 16.5931 7.32535 16.4777 7.32188C16.365 7.31928 16.2217 7.16224 16.1559 7.0399C16.1001 6.93579 16.1316 6.78656 16.1316 6.65728C16.1307 4.84221 16.1316 3.02801 16.1316 1.21294V0.720128H2.23768C2.23768 0.865022 2.23768 1.01686 2.23768 1.16782C2.23768 3.01152 2.23768 4.85523 2.23768 6.69806C2.23768 6.82734 2.26833 6.97657 2.21155 7.08068C2.15206 7.19087 2.00785 7.31928 1.89608 7.32449C1.78342 7.32882 1.62569 7.21343 1.55899 7.10931C1.4968 7.01214 1.51843 6.85944 1.51843 6.73103C1.51663 4.80143 1.51572 2.87097 1.51843 0.941373C1.51663 0.24467 1.76809 0.000867624 2.48555 0C6.90384 0 11.323 0 15.7422 0C16.649 0 16.8455 0.188275 16.8554 1.06458C16.8563 1.1791 16.8554 1.29363 16.8554 1.4472C17.0059 1.45761 17.1348 1.47236 17.2628 1.47323C18.0118 1.47583 18.7608 1.46455 19.5098 1.47756C20.5355 1.49492 21.3782 2.35734 21.0402 3.26487C20.6905 4.20277 21.2692 4.91249 21.3476 5.73066C21.3566 5.82436 21.5242 5.93889 21.6423 5.98227C22.5436 6.31197 22.9943 6.92278 22.9979 7.86155C23.0015 8.97037 23.0006 10.0792 22.9979 11.1889C22.997 11.7173 22.9366 11.7711 22.3661 11.7745C22.083 11.7763 21.8009 11.7745 21.5278 11.7745C21.0961 13.3354 20.3543 14.0173 19.1366 14C17.9469 13.9826 17.2078 13.2773 16.8382 11.7945H8.81465C8.71911 12.5597 8.44601 13.2738 7.69971 13.6425C7.27969 13.8499 6.76324 13.987 6.29545 13.974C5.15888 13.941 4.41709 13.1367 4.16922 11.7754C3.63023 11.7754 3.08042 11.7763 2.52971 11.7754C1.74196 11.7737 1.51843 11.5585 1.51482 10.8002C1.51482 10.6466 1.51482 10.493 1.51482 10.2978C1.12184 10.2978 0.775736 10.3317 0.442246 10.2831C0.278205 10.2597 0.0366502 10.1052 0.00870916 9.97421C-0.0480743 9.71392 0.181763 9.60634 0.43774 9.60547C1.51663 9.60373 2.59551 9.58985 3.67259 9.62022C3.83393 9.62456 4.09261 9.81457 4.12416 9.95686C4.18545 10.2276 3.93758 10.3013 3.68341 10.2987C3.22193 10.2952 2.75955 10.2978 2.26743 10.2978V11.077C2.90376 11.077 3.55542 11.0848 4.20618 11.0674C4.2864 11.0648 4.38825 10.9399 4.43692 10.8505C4.87586 10.0532 5.56628 9.61415 6.49644 9.61588C7.42571 9.61848 8.11432 10.0575 8.55146 10.8575C8.60374 10.9529 8.73533 11.07 8.83087 11.0709C11.241 11.083 13.6512 11.0804 16.1289 11.0804C16.1289 10.3924 16.1289 9.73561 16.1289 9.07795C16.1289 8.89055 16.0874 8.68926 16.146 8.52094C16.1974 8.37344 16.3641 8.26326 16.4795 8.13658C16.6021 8.25892 16.8184 8.37344 16.8301 8.50532C16.8743 8.99119 16.8509 9.48314 16.8527 9.97248C16.8527 10.3325 16.8527 10.6935 16.8527 11.0535L16.9852 11.0726C17.0636 10.9433 17.1393 10.8132 17.2195 10.6848C18.0694 9.32176 20.1227 9.21938 21.015 10.5538C21.3458 11.0483 21.6784 11.1733 22.2561 11.0362L22.2579 11.0353ZM16.8806 5.8877H20.6166C20.5292 5.52677 20.4562 5.19533 20.3678 4.86737C20.2633 4.47954 20.2651 3.94335 20.001 3.75161C19.7189 3.54685 19.1808 3.6579 18.7536 3.6501C18.1325 3.63968 17.5106 3.64749 16.8563 3.64749C16.8563 4.33292 16.8554 4.9498 16.8572 5.56668C16.8572 5.66385 16.8707 5.76103 16.8806 5.8877ZM8.05844 11.7988C8.05393 10.9807 7.32386 10.29 6.47571 10.3022C5.61855 10.3135 4.91732 11.0102 4.93265 11.8335C4.94797 12.6396 5.651 13.3042 6.48923 13.3068C7.34549 13.3085 8.06295 12.6196 8.05844 11.7988ZM20.7419 11.7945C20.7347 10.9737 20.0046 10.2866 19.1564 10.3022C18.3191 10.3169 17.6224 10.9919 17.6152 11.7954C17.608 12.6153 18.3236 13.3076 19.179 13.3068C20.0352 13.3068 20.7491 12.6153 20.7419 11.7945ZM20.3264 2.93084C20.238 2.39811 20.0037 2.18555 19.4971 2.1734C19.0059 2.16212 18.5138 2.1708 18.0217 2.1708C17.6422 2.1708 17.2628 2.1708 16.8842 2.1708V2.93084H20.3255H20.3264ZM22.2417 8.8463V8.11923H21.5107C21.4188 8.77342 21.5531 8.90703 22.2417 8.8463Z" fill="#22242A"/>
                    <path d="M8.79488 6.53395C9.78363 5.57783 10.712 4.67897 11.6404 3.78011C11.7251 3.69855 11.8134 3.62047 11.8945 3.53631C12.0775 3.34803 12.3155 3.21876 12.4948 3.45909C12.5768 3.56841 12.5074 3.86253 12.4047 4.00309C12.2163 4.25817 11.9513 4.45946 11.7188 4.68417C10.8715 5.49887 10.0198 6.30837 9.17974 7.13088C8.91385 7.39117 8.69393 7.40592 8.42443 7.13695C7.87372 6.58774 7.30679 6.05329 6.74256 5.51623C6.55689 5.33923 6.40907 5.14141 6.6308 4.92451C6.85162 4.70847 7.06343 4.83948 7.2473 5.02081C7.74754 5.51362 8.25138 6.00383 8.79398 6.53482L8.79488 6.53395Z" fill="#22242A"/>
                    <path d="M12.2411 10.2957C11.4038 10.2957 10.5664 10.2939 9.7291 10.2965C9.46951 10.2965 9.22255 10.2679 9.23066 9.94774C9.23787 9.63627 9.48574 9.60156 9.74352 9.60156C11.4182 9.60156 13.0937 9.60156 14.7684 9.60156C15.0253 9.60156 15.2776 9.63106 15.2885 9.93994C15.3002 10.2913 15.0226 10.2965 14.754 10.2957C13.9166 10.2939 13.0793 10.2957 12.242 10.2957H12.2411Z" fill="#22242A"/>
                    <path d="M3.42272 8.81996C2.71968 8.81996 2.01665 8.81823 1.31362 8.81996C1.04502 8.82083 0.768318 8.81302 0.775529 8.46511C0.781838 8.1545 1.03331 8.125 1.29109 8.125C2.71157 8.12674 4.13296 8.1276 5.55345 8.125C5.81573 8.125 6.0681 8.16751 6.07351 8.46511C6.07982 8.79741 5.80582 8.82343 5.53091 8.8217C4.82788 8.81649 4.12485 8.81996 3.42182 8.81996H3.42272Z" fill="#22242A"/>
                    <path d="M7.24083 11.8255C7.22731 12.2099 6.86768 12.5361 6.472 12.5231C6.07452 12.511 5.73381 12.1639 5.74643 11.7848C5.75905 11.4013 6.11958 11.0733 6.51526 11.0863C6.91455 11.0985 7.25525 11.4455 7.24173 11.8255H7.24083Z" fill="#22242A"/>
                    <path d="M19.1886 11.086C19.5869 11.0939 19.9322 11.4366 19.9249 11.8174C19.9168 12.1983 19.559 12.5315 19.1642 12.5246C18.7676 12.5176 18.4206 12.1723 18.4278 11.794C18.4351 11.4123 18.7938 11.0791 19.1886 11.086Z" fill="#22242A"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_614_145320">
                    <rect width="23" height="14" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                </span>
                <span>Tahmini teslimat, bulunduğunuz adrese göre 16 Aralık - 20 Aralık günleri arasında yapılacaktır. (Pazar günleri ve resmi tatiller hariçtir).</span>
              </div>
            </div>
          </div>

          <div v-if="step === 2">
            <div class="checkout-box">
              <div class="checkout-box__title">Kredi / Banka Kartı</div>
              <div class="checkout-box__content">
                <div class="payment-form">
                  <div class="custom-input">
                    <input type="text" placeholder="0000 0000 0000 0000" class="input" />
                    <label class="label">Kart Numarası</label>
                  </div>

                  <div class="payment-form-row">
                    <div class="custom-input">
                      <input type="text" placeholder="Ay / Yıl" class="input" />
                      <label class="label">Son Kullanma Tarihi</label>
                    </div>
                    <div class="custom-input">
                      <input type="text" placeholder="***" class="input" />
                      <label class="label">CVV</label>
                    </div>
                  </div>

                  <label class="checkbox-row">
                    <input type="checkbox" checked class="checkbox" />
                    <span style="font-size: 12px">3D Secure ile ödemek istiyorum.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="checkout__summary">
          <div class="summary-box">
            <div class="summary-item">
              <span>ARA TOPLAM</span>
              <span class="summary-bold">{{ subTotal.toFixed(2) }} TL</span>
            </div>
            <div class="summary-item">
              <span>
                KARGO 
                <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="vertical-align: middle;">
                    <path d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path>
                </svg>
              </span>
              <span class="summary-bold">ÜCRETSİZ</span>
            </div>
            <div class="summary-item">
              <span>TOPLAM İNDİRİM</span>
              <span class="summary-bold" style="color: #000">-{{ discount }} TL</span>
            </div>

            <div class="earnings-box" @click="showEarnings = !showEarnings">
              <span class="earnings-title">TOPLAM KAZANÇ</span>
              <div class="earnings-right">
                <span class="earnings-amount">↗+{{ earnings.toFixed(2) }} TL</span>
                <span class="earnings-arrow">{{ showEarnings ? '∧' : '∨' }}</span>
              </div>
            </div>

            <div class="total-section">
              <span class="total-label">TOPLAM</span>
              <span class="total-amount">{{ total.toFixed(2) }} TL</span>
            </div>

            <div class="payment-note">
              <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="min-width: 12px;">
                <path d="M10.003 11.165a.526.526 0 0 0 .526-.526V6.113a.526.526 0 1 0-1.053 0v4.527a.526.526 0 0 0 .526.526zm.002 3.248a.526.526 0 1 0 0-1.053h-.011a.526.526 0 1 0 0 1.053zM10 0a10 10 0 1 0 0 20 10 10 0 1 0 0-20m0 1.053a8.947 8.947 0 1 1 0 17.895 8.947 8.947 0 1 1 0-17.895"></path>
              </svg>
              <span>BU ADIMDA ÖDEME ALINMAYACAKTIR.</span>
            </div>

            <button
              class="button"
              @click="step === 1 ? goToPayment() : placeOrder()"
              :disabled="loading"
            >
              {{ step === 1 ? 'ONAYLA VE ÖDE' : (loading ? 'İŞLENİYOR...' : 'ÖDEMEYİ TAMAMLA') }}
            </button>
          </div>
        </aside>
      </div>
    </div>

    <div class="full-width-footer-gray">
      <div class="footer-inner-container">
          <img :src="paymentLogosImg" alt="Payment Logos" class="payment-img-full" />
      </div>
    </div>

    <div class="mobile-bar">
      <div class="mobile-left">
        <span class="mobile-label">TOPLAM</span>
        <span class="mobile-value">{{ total.toFixed(2) }} TL</span>
      </div>
      <button
        class="mobile-btn"
        @click="step === 1 ? goToPayment() : placeOrder()"
        :disabled="loading"
      >
        {{ step === 1 ? 'KAYDET VE DEVAM ET' : (loading ? '...' : 'ÖDEMEYİ TAMAMLA') }}
      </button>
    </div>

    <div v-if="showAddressModal" class="modal-overlay-side" @click="closeAddressModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeAddressModal">✕</button>

        <h2 class="modal-title">TESLİMAT ADRESİ EKLE</h2>

        <div class="modal-form">
          <div class="form-row">
            <div class="form-field">
              <label class="field-label">AD*</label>
              <input
                v-model="addressForm.firstName"
                type="text"
                class="field-input"
              />
            </div>
            <div class="form-field">
              <label class="field-label">SOYAD*</label>
              <input
                v-model="addressForm.lastName"
                type="text"
                class="field-input"
              />
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">ÜLKE*</label>
            <select v-model="addressForm.country" class="field-select">
              <option value="TÜRKİYE">TÜRKİYE</option>
            </select>
          </div>

          <div class="form-field">
            <label class="field-label">ŞEHİR*</label>
            <select v-model="addressForm.city" class="field-select">
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
            <select v-model="addressForm.district" class="field-select">
              <option value="">SEÇİNİZ</option>
              <option value="Kadıköy">Kadıköy</option>
              <option value="Beşiktaş">Beşiktaş</option>
              <option value="Şişli">Şişli</option>
            </select>
          </div>

          <div class="form-field">
            <label class="field-label">MAHALLE*</label>
            <select v-model="addressForm.neighborhood" class="field-select">
              <option value="">SEÇİNİZ</option>
              <option value="Moda">Moda</option>
              <option value="Fenerbahçe">Fenerbahçe</option>
              <option value="Caferağa">Caferağa</option>
            </select>
          </div>

          <div class="form-field">
            <label class="field-label">ADRES TARİFİ*</label>
            <textarea
              v-model="addressForm.addressDetails"
              class="field-textarea"
              rows="3"
              placeholder="LÜTFEN BURAYA ADRESİNİZİN TARİFİNİ GİRİNİZ."
            ></textarea>
          </div>

          <div class="form-field">
            <label class="field-label">CEP TELEFONU*</label>
            <input
              v-model="addressForm.phone"
              type="text"
              class="field-input"
              placeholder="0(___) ___ __ __"
            />
          </div>

          <div class="form-field">
            <label class="field-label">ADRES BAŞLIĞI (Opsiyonel)</label>
            <input
              v-model="addressForm.addressTitle"
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
                  v-model="addressForm.type"
                  type="radio"
                  value="BİREYSEL"
                  class="radio-input"
                />
                <span>BİREYSEL</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="addressForm.type"
                  type="radio"
                  value="KURUMSAL"
                  class="radio-input"
                />
                <span>KURUMSAL</span>
              </label>
            </div>
          </div>

          <button class="modal-save-btn" @click="saveAddress" :disabled="loading">
            {{ loading ? 'KAYDEDİLİYOR...' : 'YENİ ADRES EKLE' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
      <div class="delete-dialog" @click.stop>
        <button class="delete-close" @click="closeDeleteConfirm">✕</button>
        <h3 class="delete-title">ADRESİ SİL</h3>
        <p class="delete-message">
          {{ deleteAddressId ? savedAddresses.find(a => a.id === deleteAddressId)?.addressTitle : '' }} ADRESİNİZİ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?
        </p>
        <button class="delete-confirm-btn" @click="deleteAddress" :disabled="loading">
          {{ loading ? 'SİLİNİYOR...' : 'SİL' }}
        </button>
      </div>
    </div>

    <div v-if="openMenuId" class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap');

* {
  box-sizing: border-box;
}

.page-container {
  font-family: 'Libre Franklin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 0px;
}

/* HEADER */
.checkout-header {
  background-color: #f8f8f9;
  border-bottom: 1px solid #e7eaf0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 1px 1px #e7eaf0;
}

.header__container {
  padding: 16px 50px;
  height: 65px;
  display: flex;
  align-items: center;
}

.header__content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.logo-svg {
  height: 27px;
  width: auto;
}

.ssl-wrapper {
  display: flex;
  align-items: center;
}

.ssl-svg {
  height: 42px;
  width: auto;
  margin-right: 20px;
  padding-right: 20px;
  border-right: 1px solid #939497;
}

.ssl-text {
  font-size: 17px;
  text-transform: uppercase;
  color: #000000;
  font-weight: 300;
}

/* CONTENT */
.content-wrapper {
  max-width: 1250px;
  margin: 0 auto;
  padding: 22px 15px 20px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 700;
  color: #22242a;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-title {
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 700;
  color: #22242a;
}

.product-count {
  font-size: 17px;
  font-weight: 300;
  color: #22242a;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.product-count:hover {
  color: #585562;
}

/* STEPPER */
.stepper-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  width: fit-content;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;

  position: relative;     
  padding-bottom: 10px;
}

.step.active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #000;
}


.step-num {
  background: #000;
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.step-num.inactive {
  background: #ccc;
}

.step-text {
  color: #000;
}

.step-text.muted {
  color: #999;
}

/* MAIN LAYOUT */
.checkout {
  display: flex;
  gap: 24px;
}

.checkout__process {
  flex: 1;
}

.checkout__summary {
  width: 306px;
  position: sticky;
  top: 85px;
  height: fit-content;
}

/* DELIVERY TABS */
.delivery-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 0px;
}

.tab-box {
  flex: 1;
  border: 1px solid #e5e5e5;
  padding: 15px;
  cursor: pointer;
  max-width: 250px;
}

.tab-box.active {
  background: #fff;
}

.tab-box.inactive {
  background: #f9f9f9;
  color: #000000;
  font-weight: 400;
}

.tab-header {
  color: #000000;
  margin: -15px -15px 10px -15px;
  padding: 10px 15px;
  font-size: 13px;
}

.tab-header-inactive {
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 15px;
}

.tab-sub {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-black {
  background: #000;
  color: #fff;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 300;
}

.date-range {
  font-size: 11px;
  color: #666;
}

/* CHECKOUT BOX */
.checkout-box {
  background: #fff;
  border: 1px solid #e9e8ea;
  margin-bottom: 24px;
}

.checkout-box__title {
  padding: 17px 32px;
  border-bottom: 1px solid #e9e8ea;
  font-size: 16px;
  font-weight: 700;
  color: #585562;
}

.checkout-box__content {
  padding: 32px;
}

.checkout-box__sub-info {
  padding: 10px 32px;
  background: #f8f8f9;
  font-size: 12px;
  color: #4d4a58;
  display: flex;
  gap: 10px;
  align-items: center;
}

.checkout-box--panel .checkout-box__title{
  border-bottom: 0;          
  padding-top:20px;         
  padding-bottom: 10px;
}

/* خفّف البادينغ فوق محتوى العناوين */
.checkout-box--panel .checkout-box__content{
  padding-top: 18px;        
}

/* شريط الشاحنة يكون ملاصق للبوكس */
.checkout-box--panel .checkout-box__sub-info{
  border-top: 1px solid #e9e8ea;   /* خط فاصل قبل السطر الرمادي */
  padding: 14px 32px;
}

.truck-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ADDRESS GRID */
.address-grid {
  display: grid;
  grid-template-columns: repeat(2, 240px);
  gap: 15px;
}

/* SAVED ADDRESS CARD */
.addr-card {
  border: 1px solid #e0e0e0;
  padding: 25px;
  height: 200px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.2s;
  position: relative;
}

.addr-card.selected {
  border: 1px solid #00d168;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-top-left {
  display: flex;
  align-items: center;
  gap: 8px;          
}



.radio-circle {
  width:18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addr-card.selected .radio-circle {
  border-color: #000;
}

.dot {
  width: 11px;
  height: 11px;
  background: #000;
  border-radius: 50%;
}

.dots-menu {
  color: #333;
  cursor: pointer;
  padding: 5px 143px;
  user-select: none;
  display: flex;
  align-items: center;
}

.dots-menu:hover {
  background: #f5f5f5;
  border-radius: 4px;
}

.dots-menu-wrapper {
  display:flex;
  align-items: center;
}

/* DROPDOWN MENU */
.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 150px;
  margin-top: 1px;
}

.menu-item {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.2s ease;
}

.menu-item title:hover {
  background: #585562;
}

.menu-item:first-child {
  border-bottom: 1px solid #edebeb;
}

.menu-icon {
  width: 16px;
  height: 16px;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}

.addr-title {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 0px;
  text-transform: uppercase;
}

.addr-text {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin-top: 20px;
  margin-bottom: 20px;
  flex: 2;
  text-transform: uppercase;
}

.addr-name {
  font-size: 13px;
  font-weight: 200;
  color: #000;
  margin-top: auto;
}

/* ADD NEW ADDRESS CARD */
.addr-card-new {
  background: #fcfcfc;
  border: 1px solid #e0e0e0;
  padding: 20px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.addr-card-new:hover {
  background: #f5f5f5;
}

.plus-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.new-text {
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

/* FATURA SECTION STYLES */
.fatura-title {
  font-size: 18px;
  font-weight: 500;
  color: #22242a;
  margin-top: 20px;
  margin-bottom: 12px;
  text-transform: uppercase;
}

/* Custom Checkbox Styling */
.custom-checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 15px;
}

.custom-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 15px;
  width: 15px;
  background-color: #fff;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  transition: all 0.2s;
}

.custom-checkbox-container input:checked ~ .checkmark {
  background-color: #22242a; 
  border-color: #22242a;
}

.check-icon {
  display: none;
}

.custom-checkbox-container input:checked ~ .checkmark .check-icon {
  display: block; 
}

.checkbox-label {
  font-size: 11px;
  color: #000000;
}

/* Info Text Styling */
.fatura-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #22242a;
  font-size: 7px;
  text-transform: uppercase; 
}

/* PAYMENT FORM */
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.payment-form-row {
  display: flex;
  gap: 20px;
}

.custom-input {
  display: flex;
  flex-direction: column-reverse;
  flex: 1;
}

.input {
  width: 100%;
  height: 38px;
  border: none;
  border-bottom: 1px solid #908e97;
  border-radius: 0;
  outline: none;
  font-size: 14px;
  color: #22242a;
  padding: 0;
  background: transparent;
  transition: border-color 0.3s;
}

.input:focus {
  border-bottom-color: #22242a;
}

.input::placeholder {
  color: #ccc;
}

.label {
  font-size: 12px;
  color: #585562;
  font-weight: 500;
  margin-bottom: 4px;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
}

.checkbox {
  cursor: pointer;
}

/* SUMMARY BOX */
.summary-box {
  border: 1px solid #e9e8ea;
  padding: 16px;
  background: #fff;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 20px;
  color: #22242a;
}

.summary-bold {
  font-weight: 300;
  font-size: 14px;
}

.info-icon-sm {
  font-size: 12px;
}

/* EARNINGS BOX */
.earnings-box {
  background: #f8f8f9;
  padding: 12px 16px;
  margin: 0 -16px 20px -16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.earnings-title {
  font-size: 13px;
  font-weight: 600;
  color: #22242a;
}

.earnings-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.earnings-amount {
  font-size: 14px;
  font-weight: 600;
  color: #0aca6e;
}

.earnings-arrow {
  font-size: 12px;
  color: #22242a;
}

/* TOTAL SECTION */
.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e9e8ea;
  padding-top: 16px;
  margin-top: 16px;
  margin-bottom: 10px;
}

.total-label {
  font-size: 14px;
  font-weight: 600;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
}

.payment-note {
  margin: 10px 0;
  font-size: 10px;
  color: #777;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* BUTTON */
.button {
  width: 100%;
  height: 40px;
  background: #22242a;
  color: #fff;
  border: 1px solid #22242a;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.button:hover {
  background: #fff;
  color: #22242a;
}

.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* FOOTER */
.footer-gray {
  width: 100%;
  background: #f7f7f7;
  margin-top: 40px;
}

.footer-inner {
  max-width: 1900px;
  margin: 0 auto;
  padding: 0 15px;
  text-align: center;
}

.payment-img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* MOBILE BAR */
.mobile-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.mobile-left {
  display: flex;
  flex-direction: column;
}

.mobile-label {
  font-size: 11px;
  color: #777;
}

.mobile-value {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}

.mobile-btn {
  width: 160px;
  height: 40px;
  font-size: 13px;
  background: #22242a;
  color: #fff;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay-side {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
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

.modal-close:hover {
  color: #000;
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
  transition: border-color 0.3s;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  border-bottom-color: #22242a;
}

.field-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0 center;
  padding-right: 20px;
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 5px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.radio-input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

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
  transition: all 0.3s ease;
}

.modal-save-btn:hover {
  background: #000;
}

.modal-save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* DELETE CONFIRMATION DIALOG */
.delete-dialog {
  background: #fff;
  border-radius: 0;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.delete-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px;
  line-height: 1;
}

.delete-close:hover {
  color: #000;
}

.delete-title {
  font-size: 16px;
  font-weight: 700;
  color: #22242a;
  margin-bottom: 20px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.delete-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 30px;
  text-align: left;
  line-height: 1.6;
}

.delete-confirm-btn {
  width: 100%;
  height: 48px;
  background: #22242a;
  color: #fff;
  border: 1px solid #22242a;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.delete-confirm-btn:hover {
  background: #fff;
  color: #22242a;
}

.delete-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.full-width-footer-gray {
    width: 100%;
    background-color: #f7f7f7; 
    margin-top: 10px; 
}

.footer-inner-container {
    max-width: 1900px; /* نفس عرض المحتوى الرئيسي */
    margin: 0 auto;
    padding: 0 15px;
    text-align: center; /* لتوسيط الصورة */
}

.payment-img-full {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto; /* ضمان التوسيط */
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .checkout {
    flex-direction: column;
  }

  .checkout__process {
    padding: 0;
  }

  .checkout__summary {
    display: none;
  }

  .mobile-bar {
    display: flex;
  }

  .checkout-box {
    margin-bottom: 12px;
    border: none;
    border-bottom: 1px solid #e9e8ea;
  }

  .checkout-box__content {
    padding: 16px;
  }

  .header__container {
    padding: 16px 20px;
  }

  .top-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .modal-content {
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .address-grid {
    grid-template-columns: 1fr;
  }
}
</style>