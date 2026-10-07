import { NavLink } from "react-router-dom";
import chat from "../../assets/chat.png";
import folder from "../../assets/folder.png";
import "./style.css";

const ViewNavigation = () => (
  <nav className="view-navigation" aria-label="Vistas de mensajes">
    <NavLink to="/chat" className="view-navigation__link" aria-label="Chat" title="Chat">
      <span className="view-navigation__icon" style={{ "--view-icon": `url("${chat}")` }} aria-hidden="true" />
    </NavLink>
    <NavLink to="/default-page" className="view-navigation__link" aria-label="Bandeja de mensajes" title="Bandeja de mensajes">
      <span className="view-navigation__icon" style={{ "--view-icon": `url("${folder}")` }} aria-hidden="true" />
    </NavLink>
  </nav>
);

export default ViewNavigation;
