import axios from "axios";

const API_URL = "http://localhost:5000";

export const getAllRooms = async () => {
  const res = await axios.get(`${API_URL}/rooms`, {
    withCredentials: true,
  });
  return res.data;
};

export const getRoom = async (id: string) => {
  const res = await axios.get(`${API_URL}/rooms/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const createRoom = async (data: {
  name: string;
  description?: string;
  capacity: number;
  location?: string;
  price_per_hour?: number;
}) => {
  const res = await axios.post(`${API_URL}/rooms/create`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const updateRoom = async (
  id: string,
  data: Partial<{
    name: string;
    description: string;
    capacity: number;
    location: string;
    price_per_hour: number;
    status: "active" | "inactive";
  }>
) => {
  const res = await axios.put(`${API_URL}/rooms/edit`, { id, ...data }, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteRoom = async (id: string) => {
  const res = await axios.delete(`${API_URL}/rooms/remove`, {
    data: { id },
    withCredentials: true,
  });
  return res.data;
};