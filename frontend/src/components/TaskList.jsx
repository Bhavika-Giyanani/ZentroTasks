import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on("taskCreated", (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    return () => {
      socket.off("taskCreated");
    };
  }, []);

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
