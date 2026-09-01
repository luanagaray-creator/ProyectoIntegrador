import { useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  const { pathname } = useLocation();
  const footerRef = useRef(null);
  const [socialPulse, setSocialPulse] = useState(false);
  const isHome = pathname === '/' || pathname === '/home';
  const isDefaultPage = pathname === '/default-page';

  const triggerSocialPulse = () => {
    setSocialPulse(true);
    window.setTimeout(() => setSocialPulse(false), 500);
  };

  const handleContactClick = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    triggerSocialPulse();
  };

  return (
    <div className={`app ${isDefaultPage ? 'app--no-scroll' : ''}`}>
      <Header home={isHome} onContactClick={handleContactClick} />
      <main className={`app__main ${isDefaultPage ? 'app__main--no-scroll' : ''}`}>
        <Routes>
          {/* <Route path="/" element={<><Home /><About /></>} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/available-packages" element={<AvailablePackages />} />
          <Route path="/payment-page" element={<PaymentPage />} />
          <Route path="/restore-password" element={<RestorePassword />} />
          <Route path="/restore-password-code" element={<RestorePasswordCode />} />
          <Route path="/restore-password-confirm" element={<RestorePasswordConfirm />} />
          <Route path="/default-page" element={<DefaultPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="receipt" element={<Receipt />} />
        </Routes>
      </main>
      <Footer ref={footerRef} isActive={socialPulse} />
    </div>
  )
}


export default App
