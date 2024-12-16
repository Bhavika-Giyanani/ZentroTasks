import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchNumberOfTasksPerUser } from "../services/api";
import io from "socket.io-client";

const socket = io("https://task-manager-327h.onrender.com");

const TaskBarChart = () => {
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server!");
    });

    const handleBarDataUpdate = (barData) => {
      setTaskData(barData);
    };

    socket.on("bar", handleBarDataUpdate);

    const fetchData = async () => {
      try {
        const response = await fetchNumberOfTasksPerUser();
        setTaskData(response);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchData();

    return () => {
      socket.off("bar", handleBarDataUpdate);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", width: "100%", height: "100%" }}>
      <h3>Number of Tasks Assigned Per User</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={taskData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="no_of_task_assigned" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskBarChart;
