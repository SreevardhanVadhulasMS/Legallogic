import axios from "axios";

const API = "http://localhost:5000/api/chat";

export const sendMessage = async (message) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.reply;
};