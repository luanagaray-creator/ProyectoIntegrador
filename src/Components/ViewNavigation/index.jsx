import { NavLink } from "react-router-dom";
import chat from "../../assets/chat.png";
import folder from "../../assets/folder.png";
import { useAuth } from '../../auth/AuthContext';
import "./style.css";

const ViewNavigation = () => {
  const { user } = useAuth();
  const activeSpaces = user?.spaces?.filter(space => space.isActive) || [];
  const chatPath = activeSpaces.length === 1 ? `/chat?spaceId=${activeSpaces[0].id}` : '/chat';
  return (
  <nav className="view-navigation" aria-label="Vistas de mensajes">
    <NavLink to={chatPath} className="view-navigation__link" aria-label="Chat" title="Chat">
      <span className="view-navigation__icon" style={{ "--view-icon": `url("${chat}")` }} aria-hidden="true" />
    </NavLink>
    <NavLink to="/default-page" className="view-navigation__link" aria-label="Bandeja de mensajes" title="Bandeja de mensajes">
      <span className="view-navigation__icon" style={{ "--view-icon": `url("${folder}")` }} aria-hidden="true" />
    </NavLink>
  </nav>
);
};

export default ViewNavigation;
