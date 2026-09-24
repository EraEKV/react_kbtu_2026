const shows = ['Game of Thrones', 'Breaking Bad', 'The Sopranos']

export default function FavoriteShows() {
  return (
    <section className="card">
      <h2>My Top TV Series</h2>
      <ol className="ranking">
        {shows.map((show, index) => (
          <li key={show}>
            <span className="place">{index + 1}</span>
            <span>{show}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
