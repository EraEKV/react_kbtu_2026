export default function AboutPage() {
  return (
    <section className="panel prose">
      <h1>About Game Vault</h1>
      <p>
        Game Vault is a small React app for tracking a personal video game library. It started as an async
        homework (simulated API with random delays and errors) and was extended with routing.
      </p>

      <h2>Features</h2>
      <ul>
        <li>Games list with search, genre / status / platform filters, sorting and pagination</li>
        <li>Filters are saved in the URL, so a filtered list can be shared or refreshed</li>
        <li>Game page with details, “mark as completed”, edit and remove</li>
        <li>Dashboard with statistics calculated from the API data</li>
      </ul>

      <h2>Tech</h2>
      <ul>
        <li>React 19 + Vite</li>
        <li>React Router: nested routes, dynamic URLs, useSearchParams</li>
        <li>React.lazy + Suspense for page code splitting</li>
        <li>Fake API stored in localStorage with random delays and a 5% error chance</li>
      </ul>
    </section>
  )
}
