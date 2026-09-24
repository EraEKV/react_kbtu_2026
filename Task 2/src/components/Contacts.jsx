const contacts = [
  { label: 'GitHub', value: 'EraEKV', href: 'https://github.com/EraEKV' },
  { label: 'Address', value: 'Night City' },
  { label: 'Phone number', value: '42' },
]

export default function Contacts() {
  return (
    <section className="card">
      <h2>Contacts</h2>
      <ul className="contacts">
        {contacts.map(({ label, value, href }) => (
          <li key={label}>
            <span className="label">{label}</span>
            {href ? (
              <a href={href} target="_blank" rel="noreferrer">{value}</a>
            ) : (
              <span>{value}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
