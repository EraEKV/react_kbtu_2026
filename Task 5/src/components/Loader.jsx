export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="state">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  )
}
