import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";

import {
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';


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
      <Grid
        rows={data}
        columns={columns}
      >
        <SearchState defaultValue="" />
        <IntegratedFiltering />
        <Table />
        <TableHeaderRow />
        <Toolbar />
        <SearchPanel />
      </Grid>
    </Paper>
    </div>
  );
};

export default Patients;
