const User = require("../models/userModel");
const Task = require("../models/taskModel");

//^ Add a new user
exports.addUser = async (req, res) => {
  try {
    const { task_id, ...userData } = req.body;

    const user = await User.create({
      ...userData,
      task_id: task_id || [],
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//^ Fetch all users with their tasks
exports.getUsersWithTasks = async (req, res) => {
  try {
    //^ New Learning : Populate
    const users = await User.find().populate("task_id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//^ get user with number of tasks
exports.getUsersWithNumberOfTasks = async (req, res) => {
  try {
    const users = await User.find({}, "name task_id").lean().exec();

    const result = users.map((user) => ({
      name: user.name,
      no_of_task_assigned: user.task_id.length,
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users with task count:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//^ Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
