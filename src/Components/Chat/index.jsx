import Profile from "../Profile";

import ViewNavigation from "../ViewNavigation";
import { useAuth } from "../../auth/AuthContext";

import "./style.css";

const Chat = () => {
    const { user } = useAuth();

    return (
        <div className="chat">
            <div className="chat__content">
                <ViewNavigation />

                <div className="chat__content-box">
                    <div className="chat__content-boxHeader">
                        <p className="chat__content-boxTitle">3ro TIC</p>
                        {user && <Profile name={user.name} typeUser={user.typeUser} />}
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
