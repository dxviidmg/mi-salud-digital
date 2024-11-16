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

import { createConsultation } from "../apis/consultations";
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
  const [mainResourceName, setState] = useState("status");

  const currentDateChange = (newCurrentDate) => {
    console.log(newCurrentDate);
    setCurrentDate(newCurrentDate);
  };

  const [resources, setResources] = useState([]);
  const resourcesBase = [
    {
      fieldName: "patient",
      title: "Patient",
      instances: [],
    },
    {
      fieldName: "location",
      title: "Location",
      instances: [],
    },
    {
      fieldName: "status",
      title: "Status",
      instances: [
        { id: 0, text: "Sin confirmar", color: "#e5ac00" },
        { id: 1, text: "Confirmado", color: "green" },
        { id: 2, text: "Cancelado", color: "red" },
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
        console.log("user", user);
        const av = user.availabilities;

        const av2 = av.map((consultation) => ({
          id: consultation.id,
          startDate: consultation.start_time,
          endDate: consultation.end_time,
          title: consultation.title,
          location: consultation.consulting_room,
          rRule: "FREQ=WEEKLY",
        }));

        setData(av2);

        console.log("hoka", data);
        console.log("av2 ======", av2);
        const { start_time: startTime, end_time: endTime } =
          user.availability_time_range;

        const mappedConsultingRooms = user.consulting_rooms.map((room) => ({
          id: room.full_address,
          text: room.full_address,
        }));

        console.log('mappedConsultingRooms', mappedConsultingRooms)

        const mappedPatients = patientData.map((patient) => ({
          id: patient.id,
          text: patient.full_name,
        }));

        const updatedResources = [...resourcesBase];
        updatedResources[0].instances = mappedPatients;
        updatedResources[1].instances = mappedConsultingRooms;

        //        setStartTime(startTime);
        //        setEndTime(endTime);
        console.log("consultationData", consultationData);
//                setData(consultationData);



        setResources(updatedResources);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  const handleCreateConsultation = async (e) => {
    console.log("eeee", e);
    //    e.preventDefault();

    try {
      const response = await createConsultation(e);
      //      window.location.reload();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);

    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Month is zero-based, so we add 1 and pad with leading zero if needed
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);
    const seconds = ("0" + dateObj.getSeconds()).slice(-2);
    const offset = -dateObj.getTimezoneOffset(); // Get the timezone offset in minutes and reverse it

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${
      offset >= 0 ? "+" : "-"
    }${Math.abs(offset / 60)
      .toString()
      .padStart(2, "0")}:${(Math.abs(offset) % 60)
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
  };

  //const dateStr = "Fri Mar 15 2024 11:30:00 GMT-0600 (Central Standard Time)";
  //const formattedDate = formatDate(dateStr);
  //console.log(formattedDate);

  const commitChanges = ({ added, changed, deleted }) => {
    console.log(added, changed, deleted);
    setData((prevData) => {
      let newData = [...prevData];
      if (added) {
        const name_patient = resources[0].instances.filter(
          (obj) => obj.id === added.patient
        )[0].text;

        var name_patient2 =
          name_patient !== undefined && name_patient !== null
            ? "La variable tiene un valor: " + name_patient
            : "La variable no tiene un valor definido";
        added["title"] = name_patient2;
        console.log("added ==>", added);
        const formattedDate = formatDate(added["startDate"]);
        console.log(formattedDate);
        added["date_time"] = formattedDate;
        handleCreateConsultation(added);

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
