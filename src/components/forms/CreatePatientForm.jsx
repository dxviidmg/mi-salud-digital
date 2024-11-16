import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createPatient } from "../apis/patients";

const CreatePatientForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    second_last_name: "",
    phone_number: "",
  });

  const capitalize = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: capitalize(value),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createPatient(formData);
//      window.location.reload();
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <form>
      <Typography variant="h5" gutterBottom>
        Nuevo Paciente
      </Typography>
      <TextField
        label="Nombre"
        placeholder="Ingrese su nombre"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Apellido Paterno"
        placeholder="Ingrese su apellido paterno"
        fullWidth
        margin="dense"
        size="small"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Apellido Materno"
        placeholder="Ingrese su apellido paterno"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
        name="second_last_name"
        value={formData.second_last_name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Teléfono"
        placeholder="Ingrese su teléfono"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />
      <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
        Enviar
      </Button>
    </form>
  );
};

export default CreatePatientForm;
