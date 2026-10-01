import { useState } from 'react'
import { GENRES, GENRE_COLORS, STATUSES } from '../data/games.js'

const emptyForm = {
  title: '',
  studio: '',
  year: 2025,
  genre: 'RPG',
  rating: 8,
  status: 'backlog',
  tagline: '',
}

export default function AddGameForm({ onAdd }) {
  const [form, setForm] = useState(emptyForm)

  console.log('[render] AddGameForm')

  function updateField(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return

    onAdd({
      ...form,
      title: form.title.trim(),
      studio: form.studio.trim() || 'Unknown studio',
      tagline: form.tagline.trim(),
      year: Number(form.year),
      rating: Number(form.rating),
      color: GENRE_COLORS[form.genre],
    })
    setForm(emptyForm)
  }

  return (
    <form className="panel add-form" onSubmit={handleSubmit}>
      <h2>Add a game</h2>

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="e.g. Baldur's Gate 3"
          required
        />
      </label>

      <label>
        Studio
        <input
          name="studio"
          value={form.studio}
          onChange={updateField}
          placeholder="e.g. Larian Studios"
        />
      </label>

      <label>
        Tagline
        <input
          name="tagline"
          value={form.tagline}
          onChange={updateField}
          placeholder="One line about the game"
        />
      </label>

      <div className="form-row">
        <label>
          Year
          <input
            name="year"
            type="number"
            min="1970"
            max="2030"
            value={form.year}
            onChange={updateField}
          />
        </label>
        <label>
          Rating
          <input
            name="rating"
            type="number"
            min="1"
            max="10"
            value={form.rating}
            onChange={updateField}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Genre
          <select name="genre" value={form.genre} onChange={updateField}>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={updateField}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={!form.title.trim()}>
        + Add to library
      </button>
    </form>
  )
}
