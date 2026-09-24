export default function Header() {
  return (
    <header className="header card">
      <img
        className="avatar"
        src={`${import.meta.env.BASE_URL}image.png`}
        alt="Erasyl Kokenov"
      />
      <h1>Erasyl Kokenov</h1>
      <p className="subtitle">Student at KBTU · Aspiring Frontend Developer</p>
    </header>
  )
}
