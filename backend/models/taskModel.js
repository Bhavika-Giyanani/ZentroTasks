const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//^ New Learning: Pre-save middleware to update user's task_id array
taskSchema.pre("save", async function (next) {
  if (this.isNew) {
    const User = mongoose.model("User");
    const user = await User.findByIdAndUpdate(
      this.userId,
      { $push: { task_id: this._id } },
      { new: true }
    );

    if (!user) {
      const error = new Error("User not found");
      return next(error);
    }
  }
  next();
});

taskSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.userId) {
    const Task = mongoose.model("Task");
    const User = mongoose.model("User");

    const task = await Task.findById(this.getQuery()._id);

    if (task.userId) {
      await User.findByIdAndUpdate(
        task.userId,
        { $pull: { task_id: task._id } },
        { new: true }
      );
    }

    const newUser = await User.findByIdAndUpdate(
      update.userId,
      { $push: { task_id: task._id } },
      { new: true }
    );

    if (!newUser) {
      const error = new Error("New user not found");
      return next(error);
    }
  }

  next();
});

module.exports = mongoose.model("Task", taskSchema);
