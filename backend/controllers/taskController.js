const Task = require("../models/taskModel");
const User = require("../models/userModel");

//^ Get task Status Counts
exports.getTaskStatus = async (req, res) => {
  try {
    const pendingStatus = await Task.countDocuments({ status: "pending" });
    const completedStatus = await Task.countDocuments({ status: "completed" });
    res.status(201).json({
      pending: pendingStatus,
      completed: completedStatus,
    });
  } catch (error) {
    console.log("error fetching task status count");
    res.status(400).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.find({});
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//^ Add a task
exports.addTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//^ Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//^ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    // Delete the task from the Task collection
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    //^ Remove the taskId from the task_id array in the User collection
    const updatedUser = await User.findOneAndUpdate(
      { task_id: taskId },
      { $pull: { task_id: taskId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found or task not associated with any user",
      });
    }

    res.json({
      message: "Task deleted successfully and removed from user's task list",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//^ Find User Assigned Task
exports.findAssigned = async (req, res) => {
  try {
    const users = await Task.find().populate("userId");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
