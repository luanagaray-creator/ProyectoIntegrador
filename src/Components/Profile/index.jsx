import profileIcon from "../../assets/profileIcon.png";

import "./style.css";

const Profile = ({ name, typeUser }) => {
    return (
        <div className="profile">
            <img src={profileIcon} alt={name || "profile"} className="profile__icon" />
            <div className="profile__content">
                <p className="profile__content-title">{name}</p>
                <p className="profile__content-text">{typeUser}</p>
            </div>
        </div>
    );
};

export default Profile;