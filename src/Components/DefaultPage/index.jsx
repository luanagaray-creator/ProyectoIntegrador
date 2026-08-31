import { useState } from "react";

import star from "../../assets/star.png";
import cloudUp from "../../assets/cloudUp.png";
import cloudDown from "../../assets/cloudDown.png"
import clock from "../../assets/clock.png";
import chat from "../../assets/chat.png";
import folder from "../../assets/folder.png";


import "./style.css";
import { Link, useNavigate } from "react-router-dom";


const DefaultPage = () => {
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="default-page">
            <div className="default-page__content">
                <div className="default-page__content-menu">
                    <button
                        className="default-page__content-menuButton"
                        onClick={() => navigate("/chat")}
                    >
                        <img src={chat} alt="chat" className="default-page__content-iconMenu" />
                    </button>
                    <button
                        className="default-page__content-menuButton"
                        onClick={() => navigate("/")}
                    >
                        <img src={folder} alt="folder" className="default-page__content-iconMenu" />
                    </button>
                </div>
                <div className="default-page__content-menuOptions">
                    <button
                        className="default-page__content-button"
                        onClick={() => setIsComposeOpen(true)}
                    >
                        + Redactar
                    </button>
                    <Link className="default-page__content-link">
                        <img src={star} alt="start" className="default-page__content-icon" />
                        <p className="default-page__content-textOptions">Destacados</p>
                    </Link>
                    <Link className="default-page__content-link">
                        <img src={cloudUp} alt="cloudUp" className="default-page__content-icon" />
                        <p className="default-page__content-textOptions">Enviados</p>
                    </Link>
                    <Link className="default-page__content-link">
                        <img src={cloudDown} alt="cloudDOwn" className="default-page__content-icon" />
                        <p className="default-page__content-textOptions">Recibidos</p>
                    </Link>
                    <Link className="default-page__content-link">
                        <img src={clock} alt="clock" className="default-page__content-icon" />
                        <p className="default-page__content-textOptions">General</p>
                    </Link>
                </div>
                {isComposeOpen && (
                    <div className="compose-modal-overlay">
                        <div className="compose-modal">
                            <div className="compose-modal__top">
                            <button onClick={() => setIsComposeOpen(false)} className="compose-modal-overlay__button">
                                Cerrar
                            </button>
                            <input type="text" placeholder="Destinatario" className="compose-modal__input" />
                            <input type="text" placeholder="Asunto" className="compose-modal__input" />
                            </div>
                            <textarea placeholder="Escribí tu mensaje..." className="compose-modal__textArea" />

                            <button type="submit"
                            className="compose-modal-overlay__button">Enviar</button>
                        </div>
                    </div>
                )}
                <div className="default-page__content-messages">

                    <div className="default-page__content-messages-box">
                        <div className="default-page__contet-messagesboxContent">
                            <img src={star} alt="start" className="default-page__content-icon" />
                            <p className="default-page__content-text">
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                            </p>
                        </div>
                    </div>
                    <div className="default-page__content-messages-box">
                        <div className="default-page__contet-messagesboxContent">
                            <img src={cloudDown} alt="start" className="default-page__content-icon" />
                            <p className="default-page__content-text">
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                            </p>
                        </div>
                    </div>
                    <div className="default-page__content-messages-box">
                        <div className="default-page__contet-messagesboxContent">
                            <img src={cloudDown} alt="start" className="default-page__content-icon" />
                            <p className="default-page__content-text">
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                            </p>
                        </div>
                    </div>
                    <div className="default-page__content-messages-box">
                        <div className="default-page__contet-messagesboxContent">
                            <img src={cloudUp} alt="start" className="default-page__content-icon" />
                            <p className="default-page__content-text">
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                            </p>
                        </div>
                    </div>
                    <div className="default-page__content-messages-box">
                        <div className="default-page__contet-messagesboxContent">
                            <img src={cloudUp} alt="start" className="default-page__content-icon" />
                            <p className="default-page__content-text">
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                                nslkawwjdñojjdwoñklñswodpoakjsnfjnijzckscksmdclsmcñlackmamcklskdmcñscls
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default DefaultPage;