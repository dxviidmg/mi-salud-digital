import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { getPatientList } from "../apis/patients";

const columns = [
  { name: "full_name", title: "Nombre commpleto" },
  { name: "phone_number", title: "Telefono" },
];

const Patients = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData] = await Promise.all([getPatientList()]);

        const mappedPatients = patientData.map((patient) => ({
          id: patient.id,
          text: patient.full_name,
        }));

        setData(patientData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Paper>
        <Grid rows={data} columns={columns}>
          <Table />
          <TableHeaderRow />
        </Grid>
      </Paper>
    </div>
  );
};

export default Patients;
