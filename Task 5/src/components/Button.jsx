import { Link } from 'react-router'

// One look for buttons and button-like links.
// <Button onClick={...}>Save</Button> or <Button to="/games">All games</Button>
export default function Button({ variant = 'primary', to, className = '', type = 'button', ...props }) {
  const classes = `btn btn-${variant} ${className}`

  if (to) {
    return <Link to={to} className={classes} {...props} />
  }
  return <button type={type} className={classes} {...props} />
}
