import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/ai-certs")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err);
  });

// Create Task schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  dueDate: {
    type: Date,
  },
});

const Task = mongoose.model("Task", TaskSchema);

// API Endpoints

// GET /tasks: Retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET /tasks/:id: Retrieve a single task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id.trim(); // Trim the task ID to remove extra spaces
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send({ message: "Invalid Task ID" });
  }
});

// POST /tasks: Create a new task
app.post("/tasks", async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const newTask = new Task({ title, description, status, dueDate });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PUT /tasks/:id: Update an existing task by ID
app.put("/tasks/:id", async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, status, dueDate } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// DELETE /tasks/:id: Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id.trim(); // Trim the task ID to remove extra spaces
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Invalid Task ID" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
