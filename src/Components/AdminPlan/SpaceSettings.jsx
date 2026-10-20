import { useId, useState } from 'react';
import { apiRequest } from '../../auth/api';
import DeleteAction from './DeleteAction';

export default function SpaceSettings({ space, pending, onAction }) {
  const [name, setName] = useState(space.name);
  const inputId = useId();
  return <div className="admin-space-settings">
    <form onSubmit={event => {
      event.preventDefault();
      onAction(() => apiRequest(`/admin/spaces/${space.id}`, { method: 'PATCH', body: JSON.stringify({ name }) }), 'Nombre del espacio actualizado.');
    }}>
      <label htmlFor={inputId}>Nombre del espacio</label>
      <input id={inputId} value={name} onChange={event => setName(event.target.value)} required maxLength={30} disabled={pending} />
      <button className="admin-plan__primary" disabled={pending || !name.trim() || name.trim() === space.name}>Guardar nombre</button>
    </form>
    <DeleteAction label="Eliminar espacio" name={space.name} pending={pending}
      description="Se borrarán el chat grupal, sus mensajes y los accesos de este espacio. Las cuentas, el plan y las conversaciones privadas de la institución se conservarán. El lugar quedará disponible para crear otro espacio."
      onDelete={() => onAction(() => apiRequest(`/admin/spaces/${space.id}`, { method: 'DELETE' }), 'Espacio eliminado.')} />
  </div>;
}
