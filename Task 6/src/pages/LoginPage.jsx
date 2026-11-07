import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import Loader from '../components/Loader.jsx'

export default function LoginPage() {
  const { user, loading, login, loginWithGoogle, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/profile'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <Loader text="Checking session…" />
  if (user) return <Navigate to={from} replace />

  async function submit(action) {
    setBusy(true)
    try {
      await action()
      navigate(from, { replace: true })
    } catch {
      // the message is already in `error` from the context
      setBusy(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    submit(() => login(email.trim(), password))
  }

  return (
    <section className="login">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-head">
          <h1>Welcome back</h1>
          <p>Sign in to sync your game library</p>
        </div>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError()
            }}
            required
          />
        </label>
        <label className="login-field">
          <span>Password</span>
          <input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearError()
            }}
            required
          />
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="login-submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className="login-divider">or</div>
        <GoogleButton disabled={busy} onClick={() => submit(loginWithGoogle)} />

        <p className="login-note">
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  )
}
