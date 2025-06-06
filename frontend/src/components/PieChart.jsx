import { useEffect, useState } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchTaskStatus } from "../services/api";
import io from "socket.io-client";

const socket = io("https://zentrotasks.onrender.com");

const PieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#0088FE", "#00C49F"];

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server!");
    });

    const handlePieDataUpdate = (pieData) => {
      const chartData = [
        { name: "Pending", value: pieData.pending },
        { name: "Completed", value: pieData.completed },
      ];
      setData(chartData);
    };

    socket.on("pie", handlePieDataUpdate);

    const fetchData = async () => {
      try {
        const response = await fetchTaskStatus();
        const chartData = [
          { name: "Pending", value: response.pending },
          { name: "Completed", value: response.completed },
        ];
        setData(chartData);
      } catch (error) {
        console.error("Error fetching task status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      socket.off("pie", handlePieDataUpdate);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", width: "100%", height: "100%" }}>
      <h3>Task Status Distribution</h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
