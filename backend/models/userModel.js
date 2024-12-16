const mongoose = require("mongoose");
const Task = require("./taskModel"); // Import the Task model

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User problem"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "user",
    },
    task_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      await Task.updateMany({ userId: user._id }, { $set: { userId: null } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
