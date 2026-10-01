import GameCard from './GameCard.jsx'

export default function GameList({ games, keyMode, onStatusChange, onReset, onRemove }) {
  console.log('[render] GameList')

  if (games.length === 0) {
    return (
      <div className="panel empty">
        <p className="empty-title">No games here</p>
        <p>Try another filter or add a new game to your library.</p>
      </div>
    )
  }

  return (
    <ul className="game-grid">
      {games.map((game, index) => (
        <GameCard
          key={`${keyMode === 'id' ? game.id : index}-${game.resetCount}`}
          game={game}
          onStatusChange={onStatusChange}
          onReset={onReset}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}
