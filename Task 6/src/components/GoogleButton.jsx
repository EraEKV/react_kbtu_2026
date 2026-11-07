import Button from './Button.jsx'

export default function GoogleButton({ onClick, disabled }) {
  return (
    <Button variant="ghost" className="login-submit" onClick={onClick} disabled={disabled}>
      Continue with Google
    </Button>
  )
}
