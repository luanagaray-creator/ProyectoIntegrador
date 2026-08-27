import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import About from './Components/About';
import Contact from './Components/Contact';
import AvailablePackages from './Components/AvailablePackages';
import PaymentPage from './Components/PaymentPage';
import RestorePassword from './Components/RestorePassword';
import RestorePasswordCode from './Components/RestorePasswordCode';
// import DefaultPage from './Components/defaultPage';
import DefaultPage from './Components/DefaultPage';
import RestorePasswordConfirm from './Components/RestorePasswordConfirm';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === '/home';

  return (
    <div className="app">
      <Header home={isHome} />
      <Routes>
        <Route path="/" element={<><Home /><About /></>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/home" element={<><Home /><About /></>} />
        <Route path="/available-packages" element={<AvailablePackages />} />
        <Route path="/payment-page" element={<PaymentPage />} />
        <Route path="/restore-password" element={<RestorePassword />} />
        <Route path="/restore-password-code" element={<RestorePasswordCode />} />
        <Route path="/restore-password-confirm" element={<RestorePasswordConfirm />} />
        <Route path="/default-page" element={<DefaultPage />} />
      </Routes>
      <Footer />
    </div>
  )
}


export default App
