const express = require("express");
const {
  getTask,
  addTask,
  updateTask,
  deleteTask,
  findAssigned,
  getTaskStatus,
} = require("../controllers/taskController");
const router = express.Router();

router.get("/tasks", findAssigned);
router.get("/tasks_status", getTaskStatus);
router.post("/tasks", addTask); // Add
router.put("/tasks/:id", updateTask); // Update
router.delete("/tasks/:id", deleteTask); // Delete

module.exports = router;
