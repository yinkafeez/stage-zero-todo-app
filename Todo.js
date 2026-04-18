// TODO CARD DATA
const todoData = [
  {
    id: 1,
    title: "Finalize Project PRD",
    description:
      "Review all stakeholder feedback and update the final requirements document for the Q3 release. This is a long description to test the expand and collapse functionality required by the stage 1a guidelines.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-04-16T18:00:00",
    tags: ["work", "urgent"],
    isEditing: false,
    isExpanded: false,
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
    isEditing: false,
    isExpanded: false,
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
    isEditing: false,
    isExpanded: false,
  },
];

/* TIME CALCULATION LOGIC */
function getTimeRemaining(todo) {
  if (todo.status === "Done") return { text: "Completed", isOverdue: false };

  const now = new Date();
  const dueDate = new Date(todo.dueDate);
  const diffInMs = dueDate - now;

  const absMs = Math.abs(diffInMs);
  const mins = Math.floor(absMs / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (diffInMs < 0) {
    let overdueText =
      hours < 1
        ? `Overdue by ${mins}m`
        : hours < 24
          ? `Overdue by ${hours}h`
          : `Overdue by ${days}d`;
    return { text: overdueText, isOverdue: true };
  }

  if (mins < 60) return { text: `Due in ${mins}m`, isOverdue: false };
  if (hours < 24) return { text: `Due in ${hours}h`, isOverdue: false };
  return { text: `Due in ${days}d`, isOverdue: false };
}

/* UI RENDERING */
function renderTodoCards() {
  const container = document.getElementById("todo-container");
  container.innerHTML = "";

  todoData.forEach((todo) => {
    const timeInfo = getTimeRemaining(todo);
    const card = document.createElement("article");
    card.className = `todo-card ${todo.status === "Done" ? "status-done" : ""} ${timeInfo.isOverdue ? "is-overdue" : ""}`;
    card.setAttribute("data-testid", "test-todo-card");
    card.style.borderLeft = `6px solid var(--color-low)`;

    if (todo.isEditing) {
      card.innerHTML = renderEditForm(todo);
    } else {
      card.innerHTML = renderViewMode(todo, timeInfo);
    }
    container.appendChild(card);
  });
}

function renderViewMode(todo, timeInfo) {
  const isLong = todo.description.length > 50;
  return `
    <div class="todo-priority-indicator" data-testid="test-todo-priority-indicator"></div>
    <div class="todo-header">
      <div class="todo-title-group">
        <input type="checkbox" class="todo-checkbox" data-testid="test-todo-complete-toggle" 
          ${todo.status === "Done" ? "checked" : ""} onchange="handleCheckbox(${todo.id}, this.checked)">
        <h2 class="todo-title" data-testid="test-todo-title">${todo.title}</h2>
      </div>
      <div class="todo-actions">
        <button class="action-btn" data-testid="test-todo-edit-button" onclick="setEditMode(${todo.id}, true)">
          <i class="fa-regular fa-edit"></i>
        </button>
        <button class="action-btn" data-testid="test-todo-delete-button" onclick="deleteTodo(${todo.id})">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </div>

    <div class="todo-meta">
      <select class="status-control" data-testid="test-todo-status-control" onchange="updateStatus(${todo.id}, this.value)" data-status="${todo.status}">
        <option value="Pending" ${todo.status === "Pending" ? "selected" : ""}>Pending</option>
        <option value="In Progress" ${todo.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option value="Done" ${todo.status === "Done" ? "selected" : ""}>Done</option>
      </select>
      <span class="badge badge-priority badge-${todo.priority.toLowerCase()}" data-testid="test-todo-priority">${todo.priority}</span>
    </div>

    <div class="collapsible-wrapper" data-testid="test-todo-collapsible-section" id="desc-${todo.id}" style="max-height: ${todo.isExpanded || !isLong ? "1000px" : "40px"}">
      <p class="todo-description" data-testid="test-todo-description">${todo.description}</p>
    </div>
    ${
      isLong
        ? `<button class="expand-btn" data-testid="test-todo-expand-toggle" aria-expanded="${todo.isExpanded}" aria-controls="desc-${todo.id}" onclick="toggleExpand(${todo.id})">
      ${todo.isExpanded ? "Show Less" : "Read More"}</button>`
        : ""
    }

    <footer class="todo-footer">
      <div class="date-row ${timeInfo.isOverdue ? "overdue-text" : ""}" aria-live="polite">
        <i class="fa-regular fa-clock"></i>
        <span data-testid="test-todo-time-remaining">${timeInfo.text}</span>
        ${timeInfo.isOverdue ? `<span class="overdue-badge" data-testid="test-todo-overdue-indicator">OVERDUE</span>` : ""}
      </div>
    </footer>
  `;
}

function renderEditForm(todo) {
  return `
    <form class="edit-form" data-testid="test-todo-edit-form" onsubmit="saveEdit(event, ${todo.id})">
      <label for="edit-title-${todo.id}">Title</label>
      <input type="text" id="edit-title-${todo.id}" data-testid="test-todo-edit-title-input" value="${todo.title}" required>
      
      <label for="edit-desc-${todo.id}">Description</label>
      <textarea id="edit-desc-${todo.id}" data-testid="test-todo-edit-description-input">${todo.description}</textarea>
      
      <div class="form-row">
        <div>
          <label for="edit-pri-${todo.id}">Priority</label>
          <select id="edit-pri-${todo.id}" data-testid="test-todo-edit-priority-select">
            <option value="Low" ${todo.priority === "Low" ? "selected" : ""}>Low</option>
            <option value="Medium" ${todo.priority === "Medium" ? "selected" : ""}>Medium</option>
            <option value="High" ${todo.priority === "High" ? "selected" : ""}>High</option>
          </select>
        </div>
        <div>
          <label for="edit-date-${todo.id}">Due Date</label>
          <input type="datetime-local" id="edit-date-${todo.id}" data-testid="test-todo-edit-due-date-input" value="${todo.dueDate.substring(0, 16)}">
        </div>
      </div>

      <div class="edit-actions">
        <button type="submit" class="save-btn" data-testid="test-todo-save-button">Save</button>
        <button type="button" class="cancel-btn" data-testid="test-todo-cancel-button" onclick="setEditMode(${todo.id}, false)">Cancel</button>
      </div>
    </form>
  `;
}

/* EVENT HANDLERS */

// check box for the todo status
window.handleCheckbox = (id, isChecked) => {
  const todo = todoData.find((t) => t.id === id);
  todo.status = isChecked ? "Done" : "Pending";
  renderTodoCards();
};

// update status for each card
window.updateStatus = (id, newStatus) => {
  const todo = todoData.find((t) => t.id === id);
  todo.status = newStatus;
  renderTodoCards();
};

// expand function if description exceed container
window.toggleExpand = (id) => {
  const todo = todoData.find((t) => t.id === id);
  todo.isExpanded = !todo.isExpanded;
  renderTodoCards();
};

// initiate edit mode
window.setEditMode = (id, val) => {
  const todo = todoData.find((t) => t.id === id);
  todo.isEditing = val;
  renderTodoCards();
};

// save edited text
window.saveEdit = (e, id) => {
  e.preventDefault();
  const todo = todoData.find((t) => t.id === id);
  todo.title = document.getElementById(`edit-title-${id}`).value;
  todo.description = document.getElementById(`edit-desc-${id}`).value;
  todo.priority = document.getElementById(`edit-pri-${id}`).value;
  todo.dueDate = document.getElementById(`edit-date-${id}`).value;
  todo.isEditing = false;
  renderTodoCards();
};

// delete todo
window.deleteTodo = (id) => {
  if (confirm("Delete this task?")) {
    todoData = todoData.filter((t) => t.id !== id);
    renderTodoCards();
  }
};

// refresh time every 30 seconds
document.addEventListener("DOMContentLoaded", renderTodoCards);
setInterval(renderTodoCards, 30000);
