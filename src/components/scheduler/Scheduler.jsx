import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
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
  ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import { getConsultationList } from '../apis/consultations';



const MyScheduler = () => {
  const [data, setData] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()



  const currentDateChange = (newCurrentDate) => {
    console.log(newCurrentDate)
    setCurrentDate(newCurrentDate);
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    console.log('user', user.availability_time_range)
    setStartTime(user.availability_time_range.start_time)
    setEndTime(user.availability_time_range.end_time)

    


    const fetchData = async () => {
      try {
        const data = await getConsultationList();
        console.log('data', data)
        
        const map1 = data.map((x) => ({startDate: x.date_time, endDate: x.date_time_end, title: x.patient.full_name, color: 'green'}));
        console.log('map', map1)
        setData(map1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();



  }, []);






  const commitChanges = ({ added, changed, deleted }) => {
    console.log(added, changed, deleted)
    setData(prevData => {
      let newData = [...prevData];
      if (added) {
        const startingAddedId = newData.length > 0 ? newData[newData.length - 1].id + 1 : 0;
        newData = [...newData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        newData = newData.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
        ));
      }
      if (deleted !== undefined) {
        newData = newData.filter(appointment => appointment.id !== deleted);
      }
      return newData;
    });
  };










  
  
  return (
    <Paper>
      <Scheduler
        data={data}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={currentDateChange}
          defaultCurrentViewName="Week"
        />

          <EditingState
            onCommitChanges={commitChanges}
          />
        <IntegratedEditing />
        <DayView
          startDayHour={startTime}
          endDayHour={endTime}
        />
        <WeekView
          startDayHour={startTime}
          endDayHour={endTime}
        />
        <MonthView
          startDayHour={startTime}
          endDayHour={endTime}
        />
        <Toolbar />
        <ViewSwitcher />
        <DateNavigator />
        <TodayButton />
        <ConfirmationDialog />
        <Appointments />
        <AppointmentTooltip
            showDeleteButton
            showOpenButton
          />
          <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

export default MyScheduler;
