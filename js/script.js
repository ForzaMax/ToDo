const newTaskInput = document.querySelector(".new-task");
const addBtn = document.querySelector(".add-btn");
const container = document.querySelector(".todo-app");
const clearBtn = document.querySelector(".remove-all-btn");
const todoFooter = document.querySelector(".todo-footer");
const removeCompletedBtn = document.querySelector(".remove-done-btn");
const inputForm = document.querySelector(".input-area");
const removeAllBtn = document.querySelector(".remove-all-btn");
const LS_TODO_KEY = "tasks";

// переменная для редактирования
let currentlyEditing = null;

// let что бы он мутировал
let toDoArr = JSON.parse(localStorage.getItem(LS_TODO_KEY)) ?? [];

// ФУНКЦИЯ СОХРАНЕНИЯ МАССИВА ЗАДАЧ В ЛОКАЛЬНОЕ ХРАНИЛИЩЕ БРАУЗЕРА ==============================
function saveTasks() {
  localStorage.setItem(LS_TODO_KEY, JSON.stringify(toDoArr));
}

// ФУНКЦИЯ ДОБАВЛЕНИЯ ЗАДАЧИ В МАССИВ ==================================
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText.trim().length) {
    toDoArr.push({
      text: taskText,
      done: false,
      id: Date.now(),
    });

    newTaskInput.value = "";
    newTaskInput.focus();
    renderTasks();
    saveTasks();
  }
}

// ФУНКЦИЯ УДАЛЕНИЯ ЗАДАЧИ ИЗ МАССИВА ==============================
function removeTask(id) {
  toDoArr = toDoArr.filter((task) => task.id !== id);
  renderTasks();
  saveTasks();
}

// ФУНКЦИЯ УДАЛЕНИЯ ВСЕХ ЗАДАЧ ==============================
function removeAllTasks() {
  toDoArr.length = 0;
  renderTasks();
  saveTasks();
}

// ФУНКЦИЯ СМЕНЫ ЧЕКБОКСА ==============================
function toggleTaskDone(id) {
  const task = toDoArr.find((task) => task.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
  }
}

// ФУНКЦИЯ УДАЛЕНИЯ ВЫПОЛНЕННЫХ ЗАДАЧ ==============================
function removeCompletedTasks() {
  toDoArr = toDoArr.filter((task) => !task.done);
  renderTasks();
  saveTasks();
}

// ФУНКЦИЯ СОЗДАНИЯ ЭЛЕМЕНТА ЗАДАЧИ ==============================
function createTaskElement(task) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.innerHTML = `
    <label class="task-label">
      <input type="checkbox" class="task-checkbox" ${
        task.done ? "checked" : ""
      } >
      <span class="task-text">${task.text}</span>
    </label>
    <button class="edit-task-btn">✏️</button>
    <button class="delete-task-btn">❌</button>
  `;

  // ПОМЕНЯТЬ ЛОГИКУ С БУЛЕВЫМ ЗНАЧЕНИЕМ ЧЕКБОКСА

  // eventListener#7 | УДАЛЕНИЕ ЗАДАЧИ ЧЕРЕЗ ИКОНКУ УДАЛЕНИЯ
  // let deleteButton = taskItem.querySelector(".delete-task-btn");
  // deleteButton.addEventListener("click", () => removeTask(task.id));

  let deleteButton = taskItem.querySelector(".delete-task-btn");
  const onDeleteButtonClick = () => {
    removeTask(task.id);
    setInterval(() => {
      console.log("interval");
    }, 2000);
    deleteButton.removeEventListener("click", onDeleteButtonClick);
  };
  deleteButton.addEventListener("click", onDeleteButtonClick);

  // eventListener#8 | СМЕНА БУЛЕВОГО ЗНАЧЕНИЯ ЧЕРЕЗ АКТИВАЦИЮ ЧЕКБОКСА
  // let checkbox = taskItem.querySelector(".task-checkbox");
  // checkbox.addEventListener("click", () => toggleTaskDone(task.id));

  let checkbox = taskItem.querySelector(".task-checkbox");
  const onCheckboxClick = () => {
    toggleTaskDone(task.id);
    checkbox.removeEventListener("click", onCheckboxClick);
  };
  checkbox.addEventListener("click", onCheckboxClick);

  // eventListener#9 | РЕДАКТИРОВАНИЕ ЗАДАЧИ ============
  // let editButton = taskItem.querySelector(".edit-task-btn");
  // editButton.addEventListener("click", () => startEdit(taskItem, task));

  let editButton = taskItem.querySelector(".edit-task-btn");

  const onEditButtonClick = () => {
    startEdit(taskItem, task);
    editButton.removeEventListener("click", onEditButtonClick);
  };

  editButton.addEventListener("click", onEditButtonClick);

  return taskItem;
}

// ФУНКЦИЯ НАЧАЛА РЕДАКТИРОВАНИЯ ЗАДАЧИ ==============================
function editTask(text) {
  const wrapperInput = document.createElement("div");
  wrapperInput.classList.add("wrapper-input");
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = text;
  editInput.classList.add("edit-input");
  wrapperInput.append(editInput);
  return wrapperInput;
}

// ФУНКЦИЯ РЕДАКТИРОВАНИЯ ЗАДАЧИ ==============================
function startEdit(taskItem, task) {
  if (currentlyEditing !== null) return;

  currentlyEditing = task.id;

  const wrapperInput = editTask(task.text);
  const textSpan = taskItem.querySelector(".task-text");
  textSpan.replaceWith(wrapperInput);

  const input = wrapperInput.querySelector(".edit-input");
  input.focus();

  const approveButton = document.createElement("button");
  approveButton.classList.add("approve-btn");
  approveButton.textContent = "✅";

  const editButton = taskItem.querySelector(".edit-task-btn");
  editButton.replaceWith(approveButton);

  // eventListener#4| СОХРАНЕНИЕ РЕДАКТИРОВАННОГО ТЕКСТА ЧЕРЕЗ КНОПКУ "✅" ============
  const approveClick = () => {
    saveTaskEdit(task.id, input.value.trim());
    currentlyEditing = null;
    input.removeEventListener("keydown", inputKeydown);
    approveButton.removeEventListener("click", approveClick);
  };

  approveButton.addEventListener("click", approveClick);

  // eventListener#5 | СОХРАНЕНИЕ РЕДАКТИРОВАННОГО ТЕКСТА ЧЕРЕЗ ENTER И ОТМЕНА ЧЕРЕЗ "ESC" =============
  const inputKeydown = (e) => {
    if (e.key === "Enter") {
      approveClick();
    } else if (e.key === "Escape") {
      currentlyEditing = null;
      renderTasks();
      input.removeEventListener("keydown", inputKeydown);
      approveButton.removeEventListener("click", approveClick);
    }
  };

  input.addEventListener("keydown", inputKeydown);

  // eventListener#6 | ОТМЕНА РЕДАКТИРОВАНИЯ ПРИ СМЕНЕ ФОКУСА ============
  input.addEventListener("blur", () => {
    approveClick();
    currentlyEditing = null;
    renderTasks();
  });
}

// ФУНКЦИЯ СОХРАНЕНИЯ РЕДАКТИРОВАННОЙ ЗАДАЧИ ==============================
function saveTaskEdit(taskId, inputValue) {
  if (inputValue != "") {
    const task = toDoArr.find((task) => task.id === taskId);
    if (task) {
      task.text = inputValue;
      currentlyEditing = null;
      renderTasks();
      saveTasks();
    }
  } else renderTasks();
}

// ФУНКЦИЯ ОТРИСОВКИ СПИСКА ЗАДАЧ ==============================
function renderTasks() {
  let taskList = container.querySelector(".task-list");
  taskList.classList.remove("hidden");
  taskList.innerHTML = "";

  // ПЕРЕБОР МАССИВА ЗАДАЧ
  toDoArr.forEach((task) => {
    const taskItem = createTaskElement(task);
    taskList.append(taskItem);
  });

  if (toDoArr.length === 0) {
    taskList.classList.add("hidden");
  }

  renderFooter();
  saveTasks();
}

// ОТРИСОВКА ФУТЕРА ===========================
function renderFooter() {
  if (toDoArr.length > 0) {
    todoFooter.classList.remove("hidden");
  } else {
    todoFooter.classList.add("hidden");
  }
}

// eventListener#1 | ДОБАВЛЕНИЕ ЗАДАЧИ В МАССИВ
inputForm.addEventListener("submit", addTask);

// eventListener#2 | УДАЛЕНИЕ ВСЕХ ЗАДАЧ ЧЕРЕЗ КНОПКУ "УДАЛИТЬ ВСЕ"
removeAllBtn.addEventListener("click", removeAllTasks);

// eventListener#3 | УДАЛЕНИЕ ВЫПОЛНЕННЫХ ЗАДАЧ ЧЕРЕЗ КНОПКУ "УДАЛИТЬ ЗАВЕРШЕННЫЕ"
removeCompletedBtn.addEventListener("click", removeCompletedTasks);

renderTasks();
