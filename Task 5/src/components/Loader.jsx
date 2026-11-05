export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="loader" role="status">
      <div className="loader-spinner" />
      <p>{text}</p>
    </div>
  )
}
