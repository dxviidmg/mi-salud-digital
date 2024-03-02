import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/api-token-auth/`;

export const loginUser = async (credentials) => {
  try {
    console.log(apiUrl)
    const response = await axios.post(apiUrl, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
