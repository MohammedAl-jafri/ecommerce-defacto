// src/stores/useAuth.js
import { ref } from 'vue'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const user = ref(null)
const ready = ref(false)

// listen once when app starts
onAuthStateChanged(auth, (u) => {
  user.value = u
  ready.value = true
})

const useAuth = () => {
  const logout = async () => {
    await signOut(auth)
  }

  return {
    user,
    ready,
    logout
  }
}

export default useAuth
