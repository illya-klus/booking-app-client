import axios from "axios";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(
    "http://localhost:5000/auth/register",
    data,
    {
      withCredentials: true,
    }
  );

  return res.data;
};