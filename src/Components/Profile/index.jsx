import profileIcon from "../../assets/profileIcon.png";
import { Link } from "react-router-dom";

import "./style.css";

const Profile = ({ name, typeUser }) => {
    return (
        <Link to="/profile" className="profile profile--link" aria-label={`Ver perfil de ${name || 'mi cuenta'}`}>
            <img src={profileIcon} alt={name || "profile"} className="profile__icon" />
            <div className="profile__content">
                <p className="profile__content-title">{name}</p>
                <p className="profile__content-text">{typeUser}</p>
            </div>
        </Link>
    );
};

export default Profile;
