import { Navigate, useNavigate, useLocation } from "react-router-dom";

import packageJson from "../../../package.json";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const AvailablePackages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const canBuy = !user || user.canPurchase;
  const institutionId = location.state?.institutionId || user?.purchase?.institutionId || user?.managedInstitutions?.[0]?.id;
  const institution = user?.managedInstitutions?.find(item => item.id === institutionId);
  const currentPlan = institution ? institution.plan : user?.purchase?.plan;

  const planName = packageJson.planName;
  if (user && !user.canPurchase) return <Navigate to={user.typeUser === 'superadmin' ? '/platform' : '/spaces'} replace />;

  return (
    <div className="available-packages">
      <div className="available-packages__heading">
        <h1>Elegí tu paquete</h1>
        <p>Contratá un plan para tu institución y creá tus espacios con el nombre que quieras.</p>
      </div>
      <div className="available-packages__content">

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.smallPlan}
          </span>
          <span className="available-packages__price">{packageJson.planPrices.smallPlan} USD</span>

          <p className="available-packages__content-boxText">
            Hasta {packageJson.planLimits[planName.smallPlan]} espacios personalizables para tu institución, con {packageJson.planMemberLimits[planName.smallPlan]} usuarios por espacio.
          </p>

          <button
            disabled={!canBuy || currentPlan === planName.smallPlan}
            className="available-packages__content-boxButton"
            onClick={() =>
              navigate("/payment-page", {
                state: { plan: planName.smallPlan, institutionId }
              })
            }
          >
            {currentPlan === planName.smallPlan ? 'Plan Actual' : 'Elegir plan'}
          </button>
        </div>

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.mediumPlan}
          </span>
          <span className="available-packages__price">{packageJson.planPrices.mediumPlan} USD</span>

          <p className="available-packages__content-boxText">
            Hasta {packageJson.planLimits[planName.mediumPlan]} espacios personalizables para tu institución, con {packageJson.planMemberLimits[planName.mediumPlan]} usuarios por espacio.
          </p>

          <button
            disabled={!canBuy || currentPlan === planName.mediumPlan}
            className="available-packages__content-boxButton"
            onClick={() =>
              navigate("/payment-page", {
                state: { plan: planName.mediumPlan, institutionId }
              })
            }
          >
            {currentPlan === planName.mediumPlan ? 'Plan Actual' : 'Elegir plan'}
          </button>
        </div>

        <div className="available-packages__content-box">
          <span className="available-packages__content-boxTitle">
            {planName.largePlan}
          </span>
          <span className="available-packages__price">{packageJson.planPrices.largePlan} USD</span>

          <p className="available-packages__content-boxText">
            Hasta {packageJson.planLimits[planName.largePlan]} espacios personalizables para tu institución, con {packageJson.planMemberLimits[planName.largePlan]} usuarios por espacio.
          </p>

          <button
            disabled={!canBuy || currentPlan === planName.largePlan}
            className="available-packages__content-boxButton"
            onClick={() =>
              navigate("/payment-page", {
                state: { plan: planName.largePlan, institutionId }
              })
            }
          >
            {currentPlan === planName.largePlan ? 'Plan Actual' : 'Elegir plan'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AvailablePackages;
