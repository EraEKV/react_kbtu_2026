import Button from '../components/Button.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="not-found-code" aria-hidden="true">404</p>
      <StatusMessage
        title="This page doesn't exist"
        action={
          <>
            <Button to="/">Go home</Button>
            <Button to="/games" variant="ghost">All games</Button>
          </>
        }
      >
        The link may be broken, or the page was moved.
      </StatusMessage>
    </section>
  )
}
