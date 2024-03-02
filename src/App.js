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

{/* {isLoggedIn ? <CustomNavbar /> : ""} */}    

    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/scheduler/" element={<MyScheduler />} />
        </>
      ) : (
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      )}
    </Routes>
  </Router>
  );
}

export default App;
