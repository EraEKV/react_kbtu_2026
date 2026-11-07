import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import RootLayout from './layouts/RootLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import NewGamePage from './pages/NewGamePage.jsx'
import EditGamePage from './pages/EditGamePage.jsx'

// These pages are loaded only when the user opens them.
// <Suspense> for them lives in RootLayout, around <Outlet />.
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const GamesPage = lazy(() => import('./pages/GamesPage.jsx'))
const GameDetailsPage = lazy(() => import('./pages/GameDetailsPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />

        <Route path="games">
          <Route index element={<GamesPage />} />
          <Route path="new" element={<NewGamePage />} />
          <Route path=":id" element={<GameDetailsPage />} />
          <Route path=":id/edit" element={<EditGamePage />} />
        </Route>

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        {/* routes below need a signed-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
