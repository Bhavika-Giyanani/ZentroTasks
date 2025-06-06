import { useState, useEffect } from "react";
import Form from "../components/Form";
import Table from "../components/Table";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../services/api";
import userValidationSchema from "../../schema/userValidationSchema";
import io from "socket.io-client";

let socket;
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));

    socket = io("https://zentrotasks.onrender.com");

    socket.on("userCreated", (data) => {
      setUsers(data);
    });

    socket.on("userDeleted", (data) => {
      setUsers(data);
    });

    socket.on("userUpdated", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("userCreated");
      socket.off("userDeleted");
      socket.off("userUpdated");
      socket.disconnect();
    };
  }, []);

  const handleAddUser = (userData) => {
    createUser(userData).then((newUser) => {
      setIsModalOpen(false);
      setUsers((prevUsers) => [...prevUsers, newUser]);
      socket.emit("add user");
      socket.emit("change bar", "make changes in the bar chart");
    });
  };

  const handleDeleteUser = (userId) => {
    let sure = confirm("Are You SURE for deleting this User?");
    if (sure) {
      deleteUser(userId)
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          socket.emit("delete user");
        })
        .then(() => {
          socket.emit("change pie", "make changes in the pie chart");
          socket.emit("change bar", "make changes in the bar chart");
        });
    } else {
      return;
    }
  };
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const updatedUser = await updateUser(userId, updatedData);
      const processedUpdatedUser = {
        ...updatedUser,
        user:
          users.find((user) => user._id === updatedUser.userId)?.name ||
          "Unassigned",
      };
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? processedUpdatedUser : user
        )
      );
      socket.emit("change pie", "make changes in the pie chart");
      socket.emit("change bar", "make changes in the bar chart");
      socket.emit("update user");
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
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
      <h1 className="parkinsans-font">Users</h1>
      <Table
        columns={["name", "email", "role"]}
        data={users}
        onDelete={handleDeleteUser}
        onEdit={handleEditUser}
      />
      <button
        onClick={() => {
          setIsModalOpen(true);
          setSelectedUser(null);
        }}
        className="parkinsans-font"
        style={{ marginBottom: "5rem", padding: "10px 20px", fontSize: "16px" }}
      >
        Add User
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
              formTitle={selectedUser ? "Edit User" : "Add User"}
              onSubmit={(formData) =>
                selectedUser
                  ? handleUpdateUser(selectedUser._id, formData)
                  : handleAddUser(formData)
              }
              fields={[
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                },
                {
                  name: "role",
                  label: "Role",
                  type: "text",
                },
              ]}
              defaultValues={{
                name: selectedUser?.name || "",
                email: selectedUser?.email || "",
                role: selectedUser?.role || "",
              }}
              validationSchema={userValidationSchema}
              showReset={true}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
