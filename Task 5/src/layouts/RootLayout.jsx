import { Suspense } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar.jsx'
import Loader from '../components/Loader.jsx'

export default function RootLayout() {
  return (
    <div className="app">
      <NavBar />
      <main>
        <Suspense fallback={<Loader text="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="footer">Game Vault · KBTU React · Task 5</footer>
    </div>
  )
}
