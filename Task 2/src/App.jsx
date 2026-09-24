import Header from './components/Header.jsx'
import About from './components/About.jsx'
import FavoriteShows from './components/FavoriteShows.jsx'
import Contacts from './components/Contacts.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <About />
        <FavoriteShows />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
