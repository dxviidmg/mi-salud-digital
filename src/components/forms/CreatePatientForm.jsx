import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


const CreatePatientForm = () => {
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
        margin="normal"
      />
      <TextField
        label="Teléfono"
        placeholder="Ingrese su teléfono"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default CreatePatientForm;
