import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import profileIcon from '../../assets/profileIcon.png';
import './style.css';

const roleNames = { user: 'Usuario', admin: 'Administrador', superadmin: 'Super administrador' };

function Info({ label, children }) {
  return <div className="user-profile__item"><dt>{label}</dt><dd>{children || 'No informado'}</dd></div>;
}

export default function UserProfile() {
  const { user, authLoading } = useAuth();
  if (authLoading) return <p className="user-profile__status" role="status">Cargando perfil…</p>;
  if (!user) return <Navigate to="/login" replace />;

  const spaces = user.typeUser === 'admin' ? user.managedSpaces || [] : user.spaces || [];
  const institutions = user.typeUser === 'admin'
    ? user.managedInstitutions || []
    : [...new Map(spaces.map(space => [space.institutionId, { id: space.institutionId, name: space.institutionName }])).values()];

  return <section className="user-profile">
    <div className="user-profile__card">
      <header className="user-profile__header">
        <img src={profileIcon} alt="" className="user-profile__avatar" />
        <div><p className="user-profile__eyebrow">Mi cuenta</p><h1>{user.name}</h1><span className="user-profile__role">{roleNames[user.typeUser] || 'Usuario'}</span></div>
      </header>
      <section className="user-profile__section" aria-labelledby="profile-info-heading">
        <h2 id="profile-info-heading">Información personal</h2>
        <dl className="user-profile__grid">
          <Info label="Nombre">{user.name}</Info>
          <Info label="Correo electrónico">{user.email}</Info>
          <Info label="Teléfono">{user.cellPhone}</Info>
          <Info label="Estado de la cuenta">{user.isActive === false ? 'Inactiva' : 'Activa'}</Info>
        </dl>
      </section>
      {user.typeUser !== 'superadmin' && <section className="user-profile__section" aria-labelledby="profile-institutions-heading">
        <h2 id="profile-institutions-heading">{user.typeUser === 'admin' ? 'Instituciones que administras' : 'Mis instituciones'}</h2>
        {!institutions.length ? <p className="user-profile__empty">No tienes instituciones asignadas.</p> : <ul className="user-profile__list">{institutions.map(institution => <li key={institution.id}>
          <strong>{institution.name}</strong>
          {institution.plan && <span>{institution.plan}</span>}
        </li>)}</ul>}
      </section>}
      {user.typeUser !== 'superadmin' && <section className="user-profile__section" aria-labelledby="profile-spaces-heading">
        <h2 id="profile-spaces-heading">{user.typeUser === 'admin' ? 'Espacios administrados' : 'Mis espacios'}</h2>
        {!spaces.length ? <p className="user-profile__empty">No tienes espacios asignados.</p> : <ul className="user-profile__list">{spaces.map(space => <li key={space.id}>
          <strong>{space.name}</strong><span>{space.institutionName}</span>
        </li>)}</ul>}
      </section>}
    </div>
  </section>;
}
