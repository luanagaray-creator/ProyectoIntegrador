import { useEffect, useRef } from 'react';
import AdminDirectory from './AdminDirectory';

export default function AdminDirectoryDrawer({ data, pending, onAction, onClose, error, feedback }) {
  const dialogRef = useRef(null);
  const outsidePress = useRef(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  function isOutside(event) {
    if (event.target !== event.currentTarget) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  return <dialog ref={dialogRef} id="admin-directory-drawer" className="admin-directory-drawer" aria-labelledby="administrators-title" onClose={onClose}
    onPointerDown={event => { outsidePress.current = isOutside(event); }}
    onClick={event => { if (outsidePress.current && isOutside(event)) dialogRef.current.close(); }}>
    <div className="admin-directory-drawer__toolbar">
      <button type="button" className="admin-directory-drawer__close" onClick={() => dialogRef.current.close()} aria-label="Cerrar listado de administradores">
        Cerrar<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </div>
    {error && <p className="admin-directory-drawer__feedback" role="alert">{error}</p>}
    {feedback && <p className="admin-directory-drawer__feedback" role="status">{feedback}</p>}
    <AdminDirectory accounts={data.adminAccounts || []} institutions={data.institutions} assignments={data.institutionAdministrators || []} pending={pending} onAction={onAction} />
  </dialog>;
}
