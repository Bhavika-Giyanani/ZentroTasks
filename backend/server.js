const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const Task = require("./models/taskModel");
const User = require("./models/userModel");
const dontenv = require("dotenv");
dontenv.config();
const path = require("path");

const _dirname = path.resolve();
const changePie = async () => {
  try {
    const pendingStatus = await Task.countDocuments({ status: "pending" });
    const completedStatus = await Task.countDocuments({ status: "completed" });
    return {
      pending: pendingStatus,
      completed: completedStatus,
    };
  } catch (error) {
    console.log("Error fetching task status count", error);
    return { pending: 0, completed: 0 };
  }
};

const changeBar = async () => {
  try {
    const users = await User.find({}, "name task_id").lean().exec();

    const result = users.map((user) => ({
      name: user.name,
      no_of_task_assigned: user.task_id.length,
    }));
    return result;
  } catch (error) {
    console.error("Error fetching users with task count:", error);
  }
};

//^ Swagger API Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
const http = require("http");
const server = http.createServer(app);

//^ Socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://zentrotasks.onrender.com",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io !!");

  socket.on("task status", () => {
    io.emit("task status");
  });

  socket.on("change pie", async (message) => {
    console.log("Received message:", message);
    try {
      const pieData = await changePie();
      console.log("Pie Data:", pieData);
      io.emit("pie", pieData);
      console.log("Pie Data update event emitted");
    } catch (error) {
      console.error("Error fetching pie data:", error);
      io.emit("pie data update", { pending: 0, completed: 0 });
    }
  });
  socket.on("change bar", async (message) => {
    try {
      const barData = await changeBar();
      console.log("Bar Data:", barData);
      io.emit("bar", barData);
      console.log("Bar Data update event emitted");
    } catch (error) {
      console.error("Error fetching bar data:", error);
    }
  });
  socket.on("add user", async () => {
    try {
      const users = await User.find({}).lean();
      io.emit("userCreated", users);
      console.log("User table data emitted");
    } catch (error) {
      console.error("Error emitting user table data:", error);
    }
  });
  socket.on("update user", async () => {
    try {
      const users = await User.find({}).lean();
      io.emit("userUpdated", users);
      console.log("User table data emitted");
    } catch (error) {
      console.error("Error emitting user table data:", error);
    }
  });
  socket.on("delete user", async () => {
    try {
      const users = await User.find({}).lean();
      io.emit("userDeleted", users);
      console.log("User table data emitted");
    } catch (error) {
      console.error("Error emitting user table data:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED !");
  });
});

connectDB();

//^ Logger Middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

//^ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//^ Routes
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
