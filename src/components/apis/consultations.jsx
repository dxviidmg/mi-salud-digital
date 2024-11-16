import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/consultations/`;


export const getConsultationList = async () => {
  const user = JSON.parse(localStorage.getItem("user"))

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${user.token}`,
      },
    });
    return response.data.map((consultation) => ({
      id: consultation.id,
      startDate: consultation.date_time,
      endDate: consultation.date_time_end,
      title: consultation.patient.full_name,
      location: consultation.consulting_room.full_address,
      status: consultation.status,
      patient: consultation.patient.id,
    }));
  } catch (error) {
    return error;
  }
};


export const createConsultation = async (data) => {
  console.log(data)
  const user = JSON.parse(localStorage.getItem("user"))

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${user.token}`,
      },
    });

    
    return response.data;
  } catch (error) {
    return error;
  }
};