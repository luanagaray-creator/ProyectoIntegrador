import { useRef, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import About from './Components/About';
import AvailablePackages from './Components/AvailablePackages';
import PaymentPage from './Components/PaymentPage';
import RestorePassword from './Components/RestorePassword';
import RestorePasswordCode from './Components/RestorePasswordCode';
// import DefaultPage from './Components/defaultPage';
import DefaultPage from './Components/DefaultPage';
import RestorePasswordConfirm from './Components/RestorePasswordConfirm';
import Receipt from './Components/Receipt';
import Chat from './Components/Chat';
import AnswerMessage from './Components/AnswerMesagge';
import Header from './Components/Header';
import Footer from './Components/Footer';
import RequirePurchase from './auth/RequirePurchase';
import AdminPlan from './Components/AdminPlan';
import Spaces from './Components/Spaces';
import InstitutionPlatform from './Components/InstitutionPlatform';

function App() {
  const { pathname } = useLocation();
  const footerRef = useRef(null);
  const [socialPulse, setSocialPulse] = useState(false);
  const isHome = pathname === '/' || pathname === '/home';
  const isDefaultPage = pathname === '/default-page';
  const isMessagesPage = isDefaultPage || pathname === '/chat' || pathname.startsWith('/answer-message/');

  const triggerSocialPulse = () => {
    setSocialPulse(true);
    window.setTimeout(() => setSocialPulse(false), 500);
  };

  const handleContactClick = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    triggerSocialPulse();
  };

  return (
    <div className={`app ${isMessagesPage ? 'app--no-scroll' : ''}`}>
      <Header home={isHome} onContactClick={handleContactClick} />
      <main className={`app__main ${isMessagesPage ? 'app__main--no-scroll' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/available-packages" element={<AvailablePackages />} />
          <Route path="/payment-page" element={<PaymentPage />} />
          <Route path="/admin-plan" element={<AdminPlan />} />
          <Route path="/select-group" element={<Navigate to="/spaces" replace />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/platform" element={<InstitutionPlatform />} />
          <Route path="/restore-password" element={<RestorePassword />} />
          <Route path="/restore-password-code" element={<RestorePasswordCode />} />
          <Route path="/restore-password-confirm" element={<RestorePasswordConfirm />} />
          <Route path="/default-page" element={<RequirePurchase><DefaultPage /></RequirePurchase>} />
          <Route path="/chat" element={<RequirePurchase><Chat /></RequirePurchase>} />
          <Route path="receipt" element={<Receipt />} />
          <Route path="/answer-message" element={<Navigate to="/default-page" replace />} />
          <Route path="/answer-message/:threadId" element={<RequirePurchase><AnswerMessage /></RequirePurchase>} />
        </Routes>
      </main>
      <Footer ref={footerRef} isActive={socialPulse} home={isHome} />
    </div>
  )
}


export default App
