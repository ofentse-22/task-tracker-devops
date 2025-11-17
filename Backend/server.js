const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/tasks", (req, res) => res.json(tasks));

app.post("/tasks", (req, res) => {
  const now = new Date();
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    done: false,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t));
  res.json({ success: true });
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ success: true });
});

app.delete("/tasks", (req, res) => {
  tasks = [];
  res.json({ success: true });
});

const port = 5500;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
