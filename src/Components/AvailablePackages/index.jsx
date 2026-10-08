import { useNavigate } from "react-router-dom";

import packageJson from "../../../package.json";

import "./style.css";

const AvailablePackages = () => {
  const navigate = useNavigate();

  const planName = packageJson.planName;

  return (
    <div className="available-packages">
      <div className="available-packages__heading">
        <h1>Elegí tu paquete</h1>
        <p>Encontrá la opción para vos y continuá con el pago simulado.</p>
      </div>
      <div className="available-packages__content">

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.smallPlan}
          </span>
          <span className="available-packages__price">{packageJson.planPrices.smallPlan}</span>

          <p className="available-packages__content-boxText">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <button
            className="available-packages__content-boxButton"
            onClick={() =>
              navigate("/payment-page", {
                state: { plan: planName.smallPlan }
              })
            }
          >
            ¡Lo Quiero!
          </button>
        </div>

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.mediumPlan}
          </span>
          <span className="available-packages__price">{packageJson.planPrices.mediumPlan}</span>

          <p className="available-packages__content-boxText">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <button
            className="available-packages__content-boxButton"
            onClick={() =>
              navigate("/payment-page", {
                state: { plan: planName.mediumPlan }
              })
            }
          >
            ¡Lo Quiero!
          </button>
        </div>

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.largePlan}
          </span>
          <span className="available-packages__price">{packageJson.planPrices.largePlan}</span>

          <p className="available-packages__content-boxText">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <button
            className="available-packages__content-boxButton"
            onClick={() =>
              navigate("/payment-page", {
                state: { plan: planName.largePlan }
              })
            }
          >
            ¡Lo Quiero!
          </button>
        </div>

      </div>
    </div>
  );
};

export default AvailablePackages;
