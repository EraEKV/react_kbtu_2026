import { Suspense } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar.jsx'
import Loader from '../components/Loader.jsx'

export default function RootLayout() {
  return (
    <div className="layout">
      <NavBar />

      <main className="layout-main">
        {/* shows the loader while a lazy page is being downloaded */}
        <Suspense fallback={<Loader text="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="layout-footer">Game Vault · KBTU React · Task 6</footer>
    </div>
  )
}
