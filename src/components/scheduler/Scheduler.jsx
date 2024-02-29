import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';


export const getAppointmentsData = () => {
    return [
      { id: 1, startDate: '2018-06-25T09:00', endDate: '2018-06-25T10:00', title: 'Meeting' },
      { id: 2, startDate: '2018-06-26T11:00', endDate: '2018-06-26T12:00', title: 'Lunch' },
      { id: 3, startDate: '2018-06-27T13:00', endDate: '2018-06-27T14:00', title: 'Presentation' },
      // Add more hardcoded appointments as needed
    ];
  };


const Demo = () => {
  const [data, setData] = useState(getAppointmentsData());
  const [currentDate, setCurrentDate] = useState('2024-02-28');

  const currentDateChange = (newCurrentDate) => {
    setCurrentDate(newCurrentDate);
  };

  return (
    <Paper>
      <Scheduler
        data={data}
        height={660}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={currentDateChange}
        />
        <WeekView
          startDayHour={9}
          endDayHour={15}
        />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />
      </Scheduler>
    </Paper>
  );
};

export default Demo;
