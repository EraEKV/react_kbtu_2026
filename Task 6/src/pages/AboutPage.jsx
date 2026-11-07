const features = [
  'Games list with search, genre / status / platform filters, sorting and pagination',
  'Filters are saved in the URL, so a filtered list can be shared or refreshed',
  'Game page with details, “mark as completed”, edit and remove',
  'Dashboard with statistics calculated from the API data',
]

const tech = [
  'React 19 + Vite',
  'React Router: nested routes, dynamic URLs, useSearchParams',
  'React.lazy + Suspense for page code splitting',
  'Plain CSS split into global, components and pages',
  'Fake API in localStorage with random delays and a 5% error chance',
]

export default function AboutPage() {
  return (
    <section className="about">
      <p className="about-eyebrow">About the project</p>
      <h1 className="about-title">Game Vault</h1>
      <p className="about-lead">
        A small React app for tracking a personal video game library. It started as an async homework (simulated API
        with random delays and errors) and was extended with routing and new pages.
      </p>

      <div className="about-cards">
        <div className="about-card">
          <h2>Features</h2>
          <ul>
            {features.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="about-card">
          <h2>Tech</h2>
          <ul>
            {tech.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
