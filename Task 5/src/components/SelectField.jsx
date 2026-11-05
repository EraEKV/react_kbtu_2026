import { useId } from 'react'

// Labelled, controlled <select>. `options` is a list of { value, label }.
export default function SelectField({ label, value, options, onChange }) {
  const id = useId()

  return (
    <div className="select-field">
      <label htmlFor={id} className="select-field-label">
        {label}
      </label>
      <select id={id} className="select-field-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
