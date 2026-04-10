import axios from "axios";

export const login = async (data: { email: string; password: string }) => {
  const res = await axios.post("http://localhost:5000/auth/login", data, {
    withCredentials: true,
  });

  console.log(res);

  return res.data;
};