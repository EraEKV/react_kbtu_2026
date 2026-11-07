import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

// Thin wrapper around Firebase Auth. UI code never imports 'firebase/auth' directly.

export function subscribeToAuth(onUser, onError) {
  return onAuthStateChanged(auth, onUser, onError)
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password).then((cred) => cred.user)
}

export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then((cred) => cred.user)
}

export function logInWithGoogle() {
  return signInWithPopup(auth, googleProvider).then((cred) => cred.user)
}

export function logOut() {
  return signOut(auth)
}

const MESSAGES = {
  'auth/invalid-email': 'This email address is not valid.',
  'auth/missing-password': 'Enter your password.',
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/user-not-found': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-blocked': 'The sign-in popup was blocked by the browser.',
  'auth/unauthorized-domain': 'This domain is not authorized in Firebase (Authentication → Settings).',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
}

// Turns a Firebase error into a readable message
export function getAuthErrorMessage(error) {
  if (import.meta.env.DEV) console.error('[auth]', error)
  return MESSAGES[error?.code] ?? `Something went wrong (${error?.code ?? 'unknown'}). Please try again.`
}

// the user closed the Google popup: not worth showing an error
export function isCancelledByUser(error) {
  return error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request'
}
