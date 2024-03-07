import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/patients/`;


export const getPatientList = async () => {
  const user = JSON.parse(localStorage.getItem("user"))

  try {
    const response = await axios.get(apiUrl, {
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