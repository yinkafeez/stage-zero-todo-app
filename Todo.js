/* INITIAL DATA */
const todoData = [
  {
    id: 1,
    title: "Finalize Project PRD",
    description:
      "Review all stakeholder feedback and update the final requirements document for the Q3 release.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-04-16T18:00:00", // 3 days from current date (Apr 13)
    tags: ["work", "urgent"],
  },
  {
    id: 2,
    title: "Brand Identity Design",
    description:
      "Create initial sketches for the new logo and select a color palette for the mobile app.",
    priority: "Medium",
    status: "Done",
    dueDate: "2026-04-14T09:00:00", // Tomorrow
    tags: ["design"],
  },
  {
    id: 3,
    title: "Update Documentation",
    description:
      "Fix typos in the API docs and update the deployment guide for the dev team.",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-04-13T04:00:00", // Overdue by a few hours
    tags: ["work"],
  },
];

/*
  TIME CALCULATION LOGIC
 Calculates "Time Remaining" string based on the current system time.
 */
function getTimeRemaining(dateString) {
  const now = new Date();
  const dueDate = new Date(dateString);
  const diffInMs = dueDate - now;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMs < 0) {
    const overdueHours = Math.abs(diffInHours);
    return overdueHours < 1
      ? "Overdue now!"
      : `Overdue by ${overdueHours} hours`;
  }
  if (diffInHours < 1) return "Due now!";
  if (diffInHours < 24) return "Due tomorrow";
  if (diffInDays === 1) return "Due tomorrow";
  return `Due in ${diffInDays} days`;
}

/*
 RENDER FUNCTION
 Loops through the array and injects HTML into the container.
 */
function renderTodoCards() {
  const container = document.querySelector(".container");
  container.innerHTML = ""; // Clear existing content

  todoData.map((todo) => {
    const timeHint = getTimeRemaining(todo.dueDate);
    const isDone = todo.status === "Done"; // Logic check for "Done"
    const formattedDate = new Date(todo.dueDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const cardHtml = `
            <article class="todo-card" data-testid="test-todo-card" id="card-${todo.id}">
                <div class="todo-header">
                    <div class="todo-title-group">
                        <input 
                            type="checkbox" 
                            id="check-${todo.id}" 
                            class="todo-checkbox" 
                            data-testid="test-todo-complete-toggle"
                            ${isDone ? "checked" : ""}
                            onchange="toggleComplete(${todo.id}, this.checked, '${todo.status}')"
                        >
                        <label for="check-${todo.id}" class="todo-label">
                            <h2 class="todo-title" data-testid="test-todo-title">${todo.title}</h2>
                        </label>
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn" data-testid="test-todo-edit-button" onclick="editTodo('${todo.title}')">
                            <i class="fa-regular fa-edit"></i>
                        </button>
                        <button class="action-btn" data-testid="test-todo-delete-button" onclick="deleteTodo('${todo.title}')">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div class="todo-meta">
                    <span class="badge badge-priority badge-${todo.priority.toLowerCase()}" data-testid="test-todo-priority">
                        ${todo.priority}
                    </span>
                    <span class="badge badge-${todo.status.toLowerCase().trim()}" data-testid="test-todo-status" id="status-${todo.id}">
                        ${todo.status}
                    </span>
                </div>

                <p class="todo-description" data-testid="test-todo-description">${todo.description}</p>

                <ul class="todo-tags" role="list" data-testid="test-todo-tags">
                    ${todo.tags.map((tag) => `<li class="tag" data-testid="test-todo-tag-${tag.toLowerCase()}">${tag}</li>`).join("")}
                </ul>

                <footer class="todo-footer">
                    <div class="todo-dates">
                        <div class="date-row">
                            <i class="fa-regular fa-calendar"></i>
                            <time data-testid="test-todo-due-date" datetime="${todo.dueDate}">Due ${formattedDate}</time>
                        </div>
                        <div class="date-row time-remaining">
                            <i class="fa-regular fa-clock"></i>
                            <span data-testid="test-todo-time-remaining">${timeHint}</span>
                        </div>
                    </div>
                </footer>
            </article>
        `;
    container.innerHTML += cardHtml;
  });
}

// TOGGLE COMPLETE: Updates status text and badge color
window.toggleComplete = function (id, isChecked, originalStatus) {
  //   const todo = todoData.find((t) => t.id === id);
  const statusLabel = document.getElementById(`status-${id}`);
  if ((statusLabel.textContent = "Done")) return isChecked;

  if (isChecked) {
    statusLabel.textContent = "Done";
    statusLabel.classList.add("badge-done");
  } else {
    // Revert to original status from data
    statusLabel.textContent = originalStatus;
    statusLabel.classList.remove("badge-done");
  }
};

// DELETE TASK
window.deleteTodo = function (title) {
  alert(`deleted task: ${title}`);
};

// EDIT TASK
window.editTodo = function (title) {
  alert(`edited task: ${title}`);
};

/**
 * 5. INITIALIZE
 */
document.addEventListener("DOMContentLoaded", () => {
  renderTodoCards();

  // Optional: Refresh time-remaining hints every 60 seconds
  setInterval(renderTodoCards, 60000);
});
