// Shared block for error, empty and "not found" states.
export default function StatusMessage({ tone = 'info', title, children, action }) {
  return (
    <div className="status-msg" data-tone={tone} role={tone === 'error' ? 'alert' : 'status'}>
      <span className="status-msg-icon" aria-hidden="true">
        {tone === 'error' ? '!' : '∅'}
      </span>
      <h2 className="status-msg-title">{title}</h2>
      {children && <p className="status-msg-text">{children}</p>}
      {action && <div className="status-msg-actions">{action}</div>}
    </div>
  )
}
