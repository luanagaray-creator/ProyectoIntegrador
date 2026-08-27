import React from "react";
import { useNavigate } from "react-router-dom";

import packageJson from "../../../package.json";

import "./style.css";

const AvailablePackages = () => {
  const navigate = useNavigate();

  const planName = packageJson.planName;

  return (
    <div className="available-packages">
      <div className="available-packages__content">

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.smallPlan}
          </span>

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