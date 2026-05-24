import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { ADMIN_EMAIL, auth, isFirebaseConfigured } from './firebase'

const authError = 'Firebase Auth configuration missing. Update .env and enable Email/Password Auth.'

export const watchAuthState = (onUserChange) => {
  if (!isFirebaseConfigured || !auth) {
    onUserChange(null)
    return () => {}
  }

  return onAuthStateChanged(auth, onUserChange)
}

export const adminLogin = async (email, password) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(authError)
  }

  if (ADMIN_EMAIL && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Admin access denied for this email.')
  }

  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export const adminLogout = async () => {
  if (!isFirebaseConfigured || !auth) {
    return
  }

  await signOut(auth)
}
