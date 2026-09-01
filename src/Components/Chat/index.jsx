import { useNavigate } from "react-router-dom";

import Profile from "../Profile";

import chat from "../../assets/chat.png";
import folder from "../../assets/folder.png";

import "./style.css";

const Chat = () => {
    const navigate = useNavigate();

    return (
        <div className="chat">
            <div className="chat__content">
                <div className="chat__content-menu">
                    <img src={chat} alt="chat" className="chat__content-iconMenu" />
                    <button
                        className="chat__content-menuButton"
                        onClick={() => navigate("/default-page")}
                    >
                        <img src={folder} alt="folder" className="chat__content-iconMenu" />
                    </button>
                </div>

                <div className="chat__content-box">
                    <div className="chat__content-boxHeader">
                        <p className="chat__content-boxTitle">3ro TIC</p>
                        <Profile name="user" typeUser="userType"/>
                    </div>

                    <hr className="divider" />

                    <div className="chat__content-boxBody">
                        <div className="chat__content-boxMessage chat__content-boxMessage--incoming">
                            <p>¡Hola! ¿En qué puedo ayudarte?</p>
                        </div>
                        <div className="chat__content-boxMessage chat__content-boxMessage--outgoing">
                            <p>Necesito información sobre los paquetes disponibles.</p>
                        </div>
                    </div>

                    <div className="chat__content-boxComposer">
                        <textarea
                            className="chat__content-boxTextarea"
                            placeholder="Escribir..."
                            rows={1}
                        />
                        <button type="button" className="chat__content-boxSend" aria-label="Enviar mensaje">
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;