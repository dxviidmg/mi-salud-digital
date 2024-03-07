import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Resources,
  WeekView,
  DayView,
  MonthView,
  ViewSwitcher,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
} from "@devexpress/dx-react-scheduler-material-ui";
import { getConsultationList } from "../apis/consultations";
import { getPatientList } from "../apis/patients";

import { styled } from "@mui/material/styles";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import './scheduler.css'

const PREFIX = "Demo";

const classes = {
  container: `${PREFIX}-container`,
  text: `${PREFIX}-text`,
};

const MyScheduler = () => {
  const [data, setData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [mainResourceName, setState] = useState("location");
  /*  const resources = [
    {
      fieldName: 'location',
      title: 'Location',
      instances: locations,
    },
    {
      fieldName: 'patients',
      title: 'Patient',
      allowMultiple: true,
      instances: [
        { id: 1, text: 'Andrew Glover' },
        { id: 2, text: 'Arnie Schwartz' },
        { id: 3, text: 'John Heart' },
        { id: 4, text: 'Taylor Riley' },
        { id: 5, text: 'Brad Farkus' },
      ],
    },
  ]
*/

  const [resources, setResources] = useState([]);

  //  const mainResourceName = 'patients'

  const currentDateChange = (newCurrentDate) => {
    console.log(newCurrentDate);
    setCurrentDate(newCurrentDate);
  };

  useEffect(() => {


    const rb = [
      {
        fieldName: "location",
        title: "Location",
        instances: [],
      },
      {
        fieldName: "patient",
        title: "Patient",
        instances: [
        ],
      },

      {
        fieldName: "status",
        title: "Status",
        instances: [
          { id: 0, text: "Sin confirmar" },
          { id: 1, text: "Confirmado" },
          { id: 2, text: "Cancelado" },
        ],
      },
    ];


    const cargarRecursosDesdeLocalStorage = async () => {
      try {


        const user = JSON.parse(localStorage.getItem("user"));
        console.log("user", user.availability_time_range);
        setStartTime(user.availability_time_range.start_time);
        setEndTime(user.availability_time_range.end_time);
        console.log(user.consulting_rooms);

        const mapped_consulting_rooms = user.consulting_rooms.map((e) => ({
          id: e.full_address,
          text: e.full_address,
        }));

        const nuevosRecursos = [...rb];
        nuevosRecursos[0].instances = mapped_consulting_rooms;
        console.log("nuevosRecursos", nuevosRecursos);

        setResources(nuevosRecursos);
      } catch (error) {
        console.error(
          "Error al cargar recursos desde el almacenamiento local:",
          error
        );
      }
    };

    // Llamar a la función para cargar recursos desde el almacenamiento local
    cargarRecursosDesdeLocalStorage();

    const fetchData = async () => {
      try {
        const data = await getConsultationList();

        const mapped_data = data.map((e) => ({
          id: e.id,
          startDate: e.date_time,
          endDate: e.date_time_end,
          title: e.patient.full_name,
          location: e.consulting_room.full_address,
          status: e.status,
          patient: e.patient.id
        }));
        console.log("mapped_data", mapped_data);
        setData(mapped_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    const fetchData2 = async () => {
      try {
        const data2 = await getPatientList();

        const mapped_patients = data2.map((e) => ({
          id: e.id,
          text: e.full_name,
        }));
        console.log("mapped_patients", mapped_patients);
        const nuevosRecursos = [...rb];
        nuevosRecursos[1].instances = mapped_patients;
        setResources(nuevosRecursos);
        console.log("nuevosRecursos", nuevosRecursos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    fetchData();
    fetchData2()
    cargarRecursosDesdeLocalStorage();

    
  }, []);

  const commitChanges = ({ added, changed, deleted }) => {
    console.log(added, changed, deleted);
    setData((prevData) => {
      let newData = [...prevData];
      if (added) {
        const startingAddedId =
          newData.length > 0 ? newData[newData.length - 1].id + 1 : 0;
        newData = [...newData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        newData = newData.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        newData = newData.filter((appointment) => appointment.id !== deleted);
      }
      return newData;
    });
  };

  const StyledDiv = styled("div")(({ theme }) => ({
    [`&.${classes.container}`]: {
      display: "flex",
      marginBottom: theme.spacing(2),
      justifyContent: "flex-end",
    },
    [`& .${classes.text}`]: {
      ...theme.typography.h6,
      marginRight: theme.spacing(2),
    },
  }));

  const ResourceSwitcher = ({ mainResourceName, onChange, resources }) => (
    <StyledDiv className={classes.container}>
      <div className={classes.text}>Main resource name:</div>
      <Select
        variant="standard"
        value={mainResourceName}
        onChange={(e) => onChange(e.target.value)}
      >
        {resources.map((resource) => (
          <MenuItem key={resource.fieldName} value={resource.fieldName}>
            {resource.title}
          </MenuItem>
        ))}
      </Select>
    </StyledDiv>
  );


  function changeMainResource(mainResourceName) {
    setState(mainResourceName);
  }

  return (
    <>
      <ResourceSwitcher
        resources={resources}
        mainResourceName={mainResourceName}
        onChange={changeMainResource}
      />
      <Paper>
        <Scheduler data={data}>
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={currentDateChange}
            defaultCurrentViewName="Week"
          />

          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView startDayHour={startTime} endDayHour={endTime} />
          <WeekView startDayHour={startTime} endDayHour={endTime} />
          <MonthView startDayHour={startTime} endDayHour={endTime} />
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip showDeleteButton showOpenButton />

          <Resources data={resources} mainResourceName={mainResourceName} />

          <AppointmentForm/>
        </Scheduler>
      </Paper>
    </>
  );
};

export default MyScheduler;
