import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import Loader from '../components/Loader.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// returns an object { email?, password?, confirm? } with error texts
function validate({ email, password, confirm }) {
  const errors = {}
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (confirm !== password) errors.confirm = 'Passwords do not match.'
  return errors
}

export default function SignupPage() {
  const { user, loading, signup, loginWithGoogle, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  if (loading) return <Loader text="Checking session…" />
  if (user) return <Navigate to="/profile" replace />

  function change(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    clearError()
    // re-validate live, but only after the first failed submit
    if (Object.keys(errors).length) setErrors(validate(next))
  }

  async function submit(action) {
    setBusy(true)
    try {
      await action()
      navigate('/profile', { replace: true })
    } catch {
      setBusy(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate({ ...form, email: form.email.trim() })
    setErrors(found)
    if (Object.keys(found).length) return
    submit(() => signup(form.email.trim(), form.password))
  }

  return (
    <section className="login">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-head">
          <h1>Create account</h1>
          <p>Join Game Vault to keep your library in one place</p>
        </div>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => change('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <small className="login-field-error">{errors.email}</small>}
        </label>
        <label className="login-field">
          <span>Password</span>
          <input
            type="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => change('password', e.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <small className="login-field-error">{errors.password}</small>}
        </label>
        <label className="login-field">
          <span>Confirm password</span>
          <input
            type="password"
            placeholder="Repeat the password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => change('confirm', e.target.value)}
            aria-invalid={Boolean(errors.confirm)}
          />
          {errors.confirm && <small className="login-field-error">{errors.confirm}</small>}
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="login-submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign up'}
        </Button>

        <div className="login-divider">or</div>
        <GoogleButton disabled={busy} onClick={() => submit(loginWithGoogle)} />

        <p className="login-note">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  )
}
