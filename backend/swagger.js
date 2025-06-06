const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "ZentroTasks",
    description: "API Documentation for user and tasks APIs of ZentroTasks",
  },
  host: "https://zentrotasks.onrender.com",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/userRoutes.js", "./routes/taskRoutes.js"];

swaggerAutogen(outputFile, routes, doc);
