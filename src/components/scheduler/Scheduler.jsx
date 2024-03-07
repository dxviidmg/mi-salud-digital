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

import "./scheduler.css";

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

  const currentDateChange = (newCurrentDate) => {
    console.log(newCurrentDate);
    setCurrentDate(newCurrentDate);
  };

  const [resources, setResources] = useState([]);
  const resourcesBase = [
    {
      fieldName: "location",
      title: "Location",
      instances: [],
    },
    {
      fieldName: "patient",
      title: "Patient",
      instances: [],
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultationData, patientData] = await Promise.all([
          getConsultationList(),
          getPatientList(),
        ]);

        const user = JSON.parse(localStorage.getItem("user"));
        console.log("user", user.availability_time_range);
        const { start_time: startTime, end_time: endTime } =
          user.availability_time_range;

        const mappedConsultingRooms = user.consulting_rooms.map((room) => ({
          id: room.full_address,
          text: room.full_address,
        }));

        const mappedPatients = patientData.map((patient) => ({
          id: patient.id,
          text: patient.full_name,
        }));

        const updatedResources = [...resourcesBase];
        updatedResources[0].instances = mappedConsultingRooms;
        updatedResources[1].instances = mappedPatients;

        setStartTime(startTime);
        setEndTime(endTime);
        setData(
          consultationData.map((consultation) => ({
            id: consultation.id,
            startDate: consultation.date_time,
            endDate: consultation.date_time_end,
            title: consultation.patient.full_name,
            location: consultation.consulting_room.full_address,
            status: consultation.status,
            patient: consultation.patient.id,
          }))
        );
        setResources(updatedResources);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

          <AppointmentForm />
        </Scheduler>
      </Paper>
    </>
  );
};

export default MyScheduler;
