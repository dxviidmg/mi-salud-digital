import React, { useState } from "react";
import Patients from "../patients/Patients";
import Container from "@mui/material/Container";
import CustomButton from "../commons/button/Custombutton";
import CustomModal from "../commons/modal/CustomModal";
import CreatePatienForm from "../forms/CreatePatientForm";

const PatientPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log("handleopenmodal");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("handleopenmodal");
    setModalOpen(false);
  };

  return (
    <Container className="paddings">
      <CustomButton
        text={"Registrar paciente"}
        onClick={handleOpenModal}
      ></CustomButton>
      <CustomModal open={modalOpen} onClose={handleCloseModal} form={<CreatePatienForm/>} />
      <Patients />
    </Container>
  );
};

export default PatientPage;
