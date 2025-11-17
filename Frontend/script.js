const apiUrl = "http://localhost:5500/tasks";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");

async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  taskList.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");

    const textDiv = document.createElement("div");
    const date = t.date ?? "No date";
    const time = t.time ?? "No time";

    textDiv.innerHTML = `
      <strong>${t.text}</strong>
      <div class="datetime">${date} • ${time}</div>
    `;

    if (t.done) li.classList.add("done");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await fetch(`${apiUrl}/${t.id}`, { method: "DELETE" });
      loadTasks();
    });

    li.addEventListener("click", async () => {
      await fetch(`${apiUrl}/${t.id}`, { method: "PUT" });
      loadTasks();
    });

    li.appendChild(textDiv);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return alert("Please enter a task!");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const newTask = await res.json();
  if (newTask) {
    taskInput.value = "";
    loadTasks();
  }
});

clearBtn.addEventListener("click", async () => {
  if (!confirm("Clear all tasks?")) return;

  await fetch(apiUrl, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });

  loadTasks();
});

loadTasks();
