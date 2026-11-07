import { useState } from 'react'
import { GENRES, PLATFORMS, STATUSES } from '../constants.js'
import Button from './Button.jsx'

const EMPTY = {
  name: '',
  description: '',
  genre: GENRES[0],
  status: 'backlog',
  developer: '',
  releaseYear: new Date().getFullYear(),
  platform: PLATFORMS[0],
  rating: 8,
  hoursPlayed: 0,
  notes: '',
}

export default function GameForm({ title, initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function change(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        genre: form.genre,
        status: form.status,
        developer: form.developer.trim(),
        releaseYear: Number(form.releaseYear),
        platform: form.platform,
        rating: Number(form.rating),
        hoursPlayed: Number(form.hoursPlayed),
        notes: form.notes.trim(),
      })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="game-form" onSubmit={handleSubmit}>
      <h1 className="game-form-title game-form-wide">{title}</h1>

      <label className="game-form-field game-form-wide">
        <span>Name</span>
        <input value={form.name} onChange={(e) => change('name', e.target.value)} disabled={saving} autoFocus />
      </label>
      <label className="game-form-field game-form-wide">
        <span>Description</span>
        <input value={form.description} onChange={(e) => change('description', e.target.value)} disabled={saving} />
      </label>
      <label className="game-form-field">
        <span>Genre</span>
        <select value={form.genre} onChange={(e) => change('genre', e.target.value)} disabled={saving}>
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </label>
      <label className="game-form-field">
        <span>Status</span>
        <select value={form.status} onChange={(e) => change('status', e.target.value)} disabled={saving}>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
      <label className="game-form-field">
        <span>Developer</span>
        <input value={form.developer} onChange={(e) => change('developer', e.target.value)} disabled={saving} />
      </label>
      <label className="game-form-field">
        <span>Platform</span>
        <select value={form.platform} onChange={(e) => change('platform', e.target.value)} disabled={saving}>
          {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="game-form-field">
        <span>Release year</span>
        <input type="number" min="1970" max="2100" value={form.releaseYear} onChange={(e) => change('releaseYear', e.target.value)} disabled={saving} />
      </label>
      <label className="game-form-field">
        <span>Rating (1–10)</span>
        <input type="number" min="1" max="10" value={form.rating} onChange={(e) => change('rating', e.target.value)} disabled={saving} />
      </label>
      <label className="game-form-field">
        <span>Hours played</span>
        <input type="number" min="0" value={form.hoursPlayed} onChange={(e) => change('hoursPlayed', e.target.value)} disabled={saving} />
      </label>
      <label className="game-form-field game-form-wide">
        <span>Notes</span>
        <textarea rows="3" value={form.notes} onChange={(e) => change('notes', e.target.value)} disabled={saving} />
      </label>

      {error && <p className="game-form-error game-form-wide">{error}</p>}

      <div className="game-form-actions game-form-wide">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
