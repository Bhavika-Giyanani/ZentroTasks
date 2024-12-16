const express = require("express");
const {
  addUser,
  getUsersWithTasks,
  getUsersWithNumberOfTasks,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

//^ User Validation MiddleWare
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailCorrect = emailRegex.test(email);
    if (!emailCorrect) {
      return res.status(400).json({ message: "Incorrect Email." });
    }
  }
  next();
};
router.post("/users", validateUser, addUser);
router.get("/users", getUsersWithTasks);
router.get("/users_with_tasks", getUsersWithNumberOfTasks);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
