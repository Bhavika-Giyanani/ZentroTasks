const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Users And Tasks APIs",
    description: "API Documentation for user and tasks APIs",
  },
  host: "localhost:5000",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/userRoutes.js", "./routes/taskRoutes.js"];

swaggerAutogen(outputFile, routes, doc);
