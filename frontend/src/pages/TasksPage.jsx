import { useState, useEffect } from "react";
import Form from "../components/Form";
import Table from "../components/Table";
import io from "socket.io-client";
import taskValidationSchema from "../../schema/taskValidationSchema";

import {
  fetchUsers,
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/api";

let socket;
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
    socket = io("http://localhost:5000/");
    fetchTasks().then((data) => {
      const processedTasks = data.map((task) => ({
        ...task,
        user: task.userId?.name || "Unassigned",
      }));
      setTasks(processedTasks);
    });
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      const processedNewTask = {
        ...newTask,
        user:
          users.find((user) => user._id === newTask.userId)?.name ||
          "Unassigned",
      };
      setTasks((prevTasks) => [...prevTasks, processedNewTask]);
      await updateTask(newTask.userId, { task_id: newTask._id });
      socket.emit("change pie", "make changes in the pie chart");
      socket.emit("change bar", "make changes in the bar chart");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = (taskId) => {
    const sure = confirm("Are You SURE to delete this record?");
    if (sure) {
      deleteTask(taskId)
        .then(() => {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
        })
        .then(() => {
          socket.emit("change pie", "make changes in the pie chart");
          socket.emit("change bar", "make changes in the bar chart");
        });
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const updatedTask = await updateTask(taskId, updatedData);
      const processedUpdatedTask = {
        ...updatedTask,
        user:
          users.find((user) => user._id === updatedTask.userId)?.name ||
          "Unassigned",
      };
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? processedUpdatedTask : task
        )
      );
      socket.emit("change pie", "make changes in the pie chart");
      socket.emit("change bar", "make changes in the bar chart");
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 className="parkinsans-font">Tasks</h1>
      <Table
        className="parkinsans-font"
        columns={["title", "description", "user", "status"]}
        data={tasks}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />
      <button
        onClick={() => {
          setIsModalOpen(true);
          setSelectedTask(null);
        }}
        className="parkinsans-font"
        style={{ marginBottom: "5rem", padding: "10px 20px", fontSize: "16px" }}
      >
        Add Task
      </button>
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                background: "none",
                border: "none",
                fontSize: "2rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <Form
              formTitle={selectedTask ? "Edit Task" : "Add Task"}
              onSubmit={(formData) =>
                selectedTask
                  ? handleUpdateTask(selectedTask._id, formData)
                  : handleAddTask(formData)
              }
              fields={[
                {
                  name: "title",
                  label: "Task Title",
                  type: "text",
                },
                {
                  name: "description",
                  label: "Description",
                  type: "text",
                },
                {
                  name: "status",
                  label: "Status",
                  type: "dropdown",
                  options: [
                    { value: "pending", label: "Pending" },
                    { value: "completed", label: "Completed" },
                  ],
                },
                {
                  name: "userId",
                  label: "Assign To",
                  type: "dropdown",
                  options: users.map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
                },
              ]}
              defaultValues={{
                title: selectedTask?.title || "",
                description: selectedTask?.description || "",
                status: selectedTask?.status || "pending",
                userId: selectedTask?.userId ? selectedTask.userId["_id"] : "",
              }}
              validationSchema={taskValidationSchema}
              showReset={true}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
