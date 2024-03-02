import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import { getConsultationList } from '../apis/consultations';


export const getAppointmentsData = () => {
    return [
      { id: 1, startDate: '2024-02-25T09:30', endDate: '2024-02-25T10:00', title: 'Meeting'},
      { id: 2, startDate: '2024-02-26T11:00', endDate: '2024-02-26T12:00', title: 'Lunch' },
      { id: 3, startDate: '2024-02-27T13:00', endDate: '2024-02-27T14:00', title: 'Presentation' },
      // Add more hardcoded appointments as needed
    ];
  };


const Demo = () => {
  const [data, setData] = useState(getAppointmentsData());

  const [currentDate, setCurrentDate] = useState(Date());
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
        
        const map1 = data.map((x) => ({startDate: x.date_time, endDate: x.date_time_end, title: 'consulta', color: 'green'}));
        console.log('map', map1)
        setData(map1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();



  }, []);

  return (
    <Paper>
      <Scheduler
        data={data}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={currentDateChange}
        />
        <WeekView
          startDayHour={startTime}
          endDayHour={endTime}
        />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />
        <AppointmentTooltip
            showDeleteButton
          />
      </Scheduler>
    </Paper>
  );
};

export default Demo;
