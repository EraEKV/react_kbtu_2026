import { statusLabel } from '../constants.js'

export default function StatusBadge({ status }) {
  return (
    <span className="status-badge" data-status={status}>
      {statusLabel(status)}
    </span>
  )
}
