import { Navigate, useNavigate } from "react-router-dom";

import packageJson from "../../../package.json";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const AvailablePackages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canBuy = !user || user.canPurchase;

  const planName = packageJson.planName;
  if (user && !user.canPurchase) return <Navigate to={user.typeUser === 'superadmin' ? '/platform' : '/spaces'} replace />;

  return (
    <div className="available-packages">
      <div className="available-packages__heading">
        <h1>Elegí tu paquete</h1>
        <p>Planes para administradores: incluí tus espacios autorizados y habilitá a sus usuarios.</p>
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
            disabled={!canBuy}
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
            disabled={!canBuy}
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
            disabled={!canBuy}
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
