import { Navigate, useNavigate, useLocation } from "react-router-dom";

import packageJson from "../../../package.json";

import "./style.css";
import { useAuth } from "../../auth/AuthContext";
import { memberCapacityForPlan } from '../../auth/planCapacity';

const AvailablePackages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const canBuy = !user || user.canPurchase;
  const institutionId = location.state?.institutionId || user?.purchase?.institutionId || user?.managedInstitutions?.[0]?.id;
  const institution = user?.managedInstitutions?.find(item => item.id === institutionId);
  const currentPlan = institution ? institution.plan : user?.purchase?.plan;

  const planName = packageJson?.planName || { smallPlan: 'Small Plan', mediumPlan: 'Medium Plan', largePlan: 'Large Plan' };
  const planLimits = packageJson?.planLimits || { 'Small Plan': 10, 'Medium Plan': 20, 'Large Plan': 30 };
  const planPrices = packageJson?.planPrices || { smallPlan: 200, mediumPlan: 350, largePlan: 450 };
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
          <span className="available-packages__price">{planPrices.smallPlan} USD</span>

          <p className="available-packages__content-boxText">
            Hasta {planLimits[planName.smallPlan]} espacios personalizables para tu institución, con {memberCapacityForPlan(planName.smallPlan)} usuarios por espacio.
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
          <span className="available-packages__price">{planPrices.mediumPlan} USD</span>

          <p className="available-packages__content-boxText">
            Hasta {planLimits[planName.mediumPlan]} espacios personalizables para tu institución, con {memberCapacityForPlan(planName.mediumPlan)} usuarios por espacio.
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
          <span className="available-packages__price">{planPrices.largePlan} USD</span>

          <p className="available-packages__content-boxText">
            Hasta {planLimits[planName.largePlan]} espacios personalizables para tu institución, con {memberCapacityForPlan(planName.largePlan)} usuarios por espacio.
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
