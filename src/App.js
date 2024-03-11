import logo from './logo.svg';
import './App.css';
import MyScheduler from './components/scheduler/Scheduler';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from './components/login/Login';
import Demo2 from './components/scheduler/Scheduler2';
import ResponsiveAppBar from './components/appbar/Appbar';
import Patients from './components/patients/Patients';
import PatientPage from './components/pages/PatientPage';
import SchedulerPage from './components/pages/SchedulerPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Chequear si hay un token en el almacenamiento local
    const storedToken = localStorage.getItem("user");
    if (storedToken) {
      // Si hay un token, establecer el estado de inicio de sesión y actualizar el token
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
  };

  return (
    <Router>

{isLoggedIn ? <ResponsiveAppBar /> : ""}    

    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/scheduler/" element={<SchedulerPage />} />
          <Route path="/scheduler2/" element={<Demo2 />} />
          <Route path="/patients/" element={<PatientPage />} />
        </>
      ) : (
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      )}
    </Routes>
  </Router>
  );
}

export default App;
