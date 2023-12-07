export class taskView {
  constructor() {
    this.tasksList = document.querySelector(".todo-app");
    this.newTaskInput = document.querySelector(".new-task");
    this.addBtn = document.querySelector(".add-btn");
    this.clearBtn = document.querySelector(".remove-all-btn");
    this.todoFooter = document.querySelector(".todo-footer");
    this.removeCompletedBtn = document.querySelector(".remove-done-btn");
    this.inputForm = document.querySelector(".input-area");
    this.removeAllBtn = document.querySelector(".remove-all-btn");
    this.currentlyEditing = null;
    this.container = document.querySelector(".todo-app");
    this.LS_TODO_KEY = "tasks";

    this.taskList = this.container.querySelector(".task-list");
  }

  createTaskElement(task) {
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

    this.deleteButton = taskItem.querySelector(".delete-task-btn");
    this.checkbox = taskItem.querySelector(".task-checkbox");
    this.editButton = taskItem.querySelector(".edit-task-btn");

    // ЧЕТО СДЕЛАТЬ С ОБРАБОТЧИКАМИ, НЕЛЬЗЯ ССЫЛАТЬСЯ НА КОНТРОЛЛЕР
    // const onDeleteButtonClick = () => {
    //   this.controller.removeTask(task.id);
    //   setInterval(() => {
    //     console.log("interval");
    //   }, 2000);
    //   this.deleteButton.removeEventListener("click", onDeleteButtonClick);
    // };
    // this.deleteButton.addEventListener("click", onDeleteButtonClick);

    // const onCheckboxClick = () => {
    //   this.controller.toggleTaskDone(task.id);
    //   this.checkbox.removeEventListener("click", onCheckboxClick);
    // };
    // this.checkbox.addEventListener("click", onCheckboxClick);

    // const onEditButtonClick = () => {
    //   this.controller.startEdit(taskItem, task);
    //   this.editButton.removeEventListener("click", onEditButtonClick);
    // };

    // this.editButton.addEventListener("click", onEditButtonClick);

    return taskItem;
  }

  editTask(newText) {
    const wrapperInput = document.createElement("div");
    wrapperInput.classList.add("wrapper-input");
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = newText;
    editInput.classList.add("edit-input");
    wrapperInput.append(editInput);
    return wrapperInput;
  }

  renderTasks(toDoArr) {
    this.taskList.classList.remove("hidden");
    this.taskList.innerHTML = "";

    toDoArr.forEach((task) => {
      const taskItem = this.createTaskElement(task);
      this.taskList.append(taskItem);
    });

    if (toDoArr.length === 0) {
      this.taskList.classList.add("hidden");
    }

    this.renderFooter(toDoArr);
  }

  renderFooter(toDoArr) {
    if (toDoArr.length > 0) {
      this.todoFooter.classList.remove("hidden");
    } else {
      this.todoFooter.classList.add("hidden");
    }
  }
}
