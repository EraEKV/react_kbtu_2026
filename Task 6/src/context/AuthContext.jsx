import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isFirebaseConfigured } from '../firebase.js'
import {
  getAuthErrorMessage,
  isCancelledByUser,
  logIn,
  logInWithGoogle,
  logOut,
  signUp,
  subscribeToAuth,
} from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true until Firebase tells us whether a saved session exists (prevents a flash of "logged out")
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState(
    isFirebaseConfigured ? null : 'Firebase is not configured. Fill in .env.local (see .env.example).',
  )

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined
    // fires on startup (restored session), login and logout
    return subscribeToAuth(
      (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      },
      (err) => {
        setError(getAuthErrorMessage(err))
        setLoading(false)
      },
    )
  }, [])

  // Runs an auth action. Errors are stored in context AND rethrown so a form can stay on the page.
  const run = useCallback(async (action) => {
    setError(null)
    try {
      return await action()
    } catch (err) {
      if (!isCancelledByUser(err)) setError(getAuthErrorMessage(err))
      throw err
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      clearError: () => setError(null),
      signup: (email, password) => run(() => signUp(email, password)),
      login: (email, password) => run(() => logIn(email, password)),
      loginWithGoogle: () => run(() => logInWithGoogle()),
      logout: () => run(() => logOut()),
    }),
    [user, loading, error, run],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
