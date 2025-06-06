import axios from "axios";

const API_URL = "https://zentrotasks.onrender.com/api";

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  console.log("deleted", response);
};
export const updateUser = async (userId, data) => {
  let response = await axios.put(`${API_URL}/users/${userId}`, data);
  console.log("updated", response);
  return response.data;
};
export const updateTask = async (task_id, data) => {
  let response = await axios.put(`${API_URL}/tasks/${task_id}`, data);
  console.log("updated", response);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
  console.log("deleted", response);
};
export const updateTaskId = async (userId, { task_id }) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, { task_id });
  return response.data;
};

export const fetchTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData);
  return response.data;
};

export const fetchTaskStatus = async () => {
  const response = await axios.get(`${API_URL}/tasks_status`);
  return response.data;
};

export const fetchNumberOfTasksPerUser = async () => {
  const response = await axios.get(`${API_URL}/users_with_tasks`);
  return response.data;
};
