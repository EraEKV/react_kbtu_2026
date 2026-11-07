import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  async function handleLogout() {
    setBusy(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setBusy(false)
    }
  }

  return (
    <section className="login">
      <div className="login-card">
        <div className="login-head">
          <h1>Profile</h1>
          <p>You are signed in</p>
        </div>

        <dl className="profile-facts">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>UID</dt>
            <dd className="profile-uid">{user.uid}</dd>
          </div>
        </dl>

        <Button variant="danger" className="login-submit" onClick={handleLogout} disabled={busy}>
          {busy ? 'Signing out…' : 'Log out'}
        </Button>
      </div>
    </section>
  )
}
