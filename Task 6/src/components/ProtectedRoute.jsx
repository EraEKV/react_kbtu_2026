import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from './Loader.jsx'

// Wrap routes that need a signed-in user. Guests are sent to /login
// and come back to the page they wanted after signing in.
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader text="Checking session…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
