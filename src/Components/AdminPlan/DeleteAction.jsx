import { useId, useState } from 'react';

export default function DeleteAction({ label, name, description, pending, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const titleId = useId();
  if (!confirming) return <button type="button" className="admin-plan__danger" disabled={pending} onClick={() => setConfirming(true)}>{label}</button>;
  return <div className="admin-plan__cancellation" role="group" aria-labelledby={titleId}>
    <p id={titleId}><strong>¿Eliminar «{name}»?</strong></p>
    <p>{description} Esta acción no se puede deshacer.</p>
    <div className="admin-plan__delete-actions">
      <button type="button" className="admin-plan__danger" disabled={pending} onClick={async () => { if (await onDelete()) setConfirming(false); }}>{pending ? 'Eliminando…' : 'Confirmar eliminación'}</button>
      <button type="button" className="admin-plan__primary" disabled={pending} onClick={() => setConfirming(false)}>Conservar</button>
    </div>
  </div>;
}
