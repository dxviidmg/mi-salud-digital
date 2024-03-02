import React, { useState } from "react";
import { loginUser } from "../apis/login";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [alertData, setAlertData] = useState({
    shown: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showAlert = (message) => {
    setAlertData({
      shown: true,
      message: message,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);
      localStorage.setItem("user", JSON.stringify(response));

      if ("user_id" in response) {
        onLogin(response);
        navigate("/scheduler/");
      } else {
        showAlert("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        showAlert("Usuario o contraseña incorrecta");
      } else {
        showAlert("Error desconocido");
      }
    }
  };

  return (
    <div id="login">

        
      <div container spacing={3}>
        <div className="justify-content-center">
          <div
            md={6}
            lg={3}
            id="login-col"
            className="d-flex align-items-center"
          >
            <form className="Auth-form">
              <div className="Auth-form-content">
                <h3 className="Auth-form-title text-center">Iniciar sesión</h3>
                <div className="form-group mt-3">
                  <label>Usuario</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Usuario"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                <button
                      type="submit"
                      className="btn btn-success"
                      onClick={handleSubmit}
                    >
                      Iniciar sesión
                    </button>



                </div>
                {alertData.shown && (
                  <div variant="danger" className="mt-3">
                    {alertData.message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
