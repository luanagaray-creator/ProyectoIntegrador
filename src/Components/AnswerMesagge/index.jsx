import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./style.css";

const AnswerMessage = ({ message }) => {
    const [responseText, setResponseText] = useState("");
    const navigate = useNavigate();

    const handleSendResponse = () => {
        if (responseText.trim()) {
            console.log("Respuesta enviada:", responseText);
            setResponseText("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleSendResponse();
        }
    };

    return (
        <div className="answer-message">
            <div className="answer-message__content">
                <div className="answer-message__content-box">
                    <div className="answer-message__content-header">
                        <button 
                            className="answer-message__content-backButton"
                            onClick={() => navigate("/default-page")}
                        >
                             Volver
                        </button>
                    </div>

                    <hr className="divider" />

                    <div className="answer-message__content-body">
                        <div className="answer-message__content-message answer-message__content-message--incoming">
                            <p>{message}</p>
                        </div>
                    </div>

                    <div className="answer-message__content-composer">
                        <textarea
                            className="answer-message__content-textarea"
                            placeholder="Escribir tu respuesta..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={3}
                        />
                        <button 
                            type="button" 
                            className="answer-message__content-send"
                            onClick={handleSendResponse}
                            aria-label="Enviar respuesta"
                        >
                            <span className="answer-message__content-send-text">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnswerMessage;
