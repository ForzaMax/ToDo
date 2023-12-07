// Контроллер вызывает изменение модели
import { taskModel, LS_TODO_KEY } from "./model.js";
import { taskView } from "./view.js";

export class taskController {
  constructor() {
    this.model = new taskModel();
    this.view = new taskView();

    this.view.inputForm.addEventListener("submit", this.addTask.bind(this));
  }

  updateLocalStorage() {
    localStorage.setItem(LS_TODO_KEY, JSON.stringify(this.model.todoArr));
  }

  addTask(e) {
    e.preventDefault();
    const taskText = this.view.newTaskInput.value.trim();

    this.model.todoArr.push({ text: taskText, done: false, id: Date.now() });
    this.view.newTaskInput.value = "";
    this.view.newTaskInput.focus();
    console.log(this.model.todoArr);
    this.view.renderTasks(this.model.todoArr);
    this.updateLocalStorage();
  }

  removeTask(id) {
    this.model.todoArr = this.model.todoArr.filter((task) => task.id !== id);
    this.view.renderTasks(this.model.todoArr);
    this.updateLocalStorage();
  }

  removeAllTasks() {
    this.model.todoArr.length = 0;
    this.view.renderTasks(this.model.todoArr);
    this.updateLocalStorage();
  }

  toggleTaskDone(id) {
    const task = this.model.todoArr.find((task) => task.id === id);
    if (task) {
      task.done = !task.done;
      this.view.renderTasks(this.model.todoArr);
      this.updateLocalStorage();
    }
  }

  removeCompletedTasks() {
    this.model.todoArr = this.model.todoArr.filter((task) => !task.done);
    this.view.renderTasks(this.model.todoArr);
    this.updateLocalStorage();
  }

  startEdit(taskItem, task) {
    if (this.view.currentlyEditing !== null) return;
    this.view.currentlyEditing = task.id;

    const wrapperInput = this.view.editTask(task.text);
    const textSpan = taskItem.querySelector(".task-text");
    textSpan.replaceWith(wrapperInput);

    const input = wrapperInput.querySelector(".edit-input");
    input.focus();

    const approveButton = document.createElement("button");
    approveButton.classList.add("approve-btn");
    approveButton.textContent = "✅";

    const editButton = taskItem.querySelector(".edit-task-btn");
    editButton.replaceWith(approveButton);

    const approveClick = () => {
      this.saveTaskEdit(task.id, input.value.trim());
      this.view.currentlyEditing = null;
      input.removeEventListener("keydown", inputKeydown);
      approveButton.removeEventListener("click", approveClick);
    };
    approveButton.addEventListener("click", approveClick);

    const inputKeydown = (e) => {
      if (e.key === "Enter") {
        approveClick();
      } else if (e.key === "Escape") {
        this.view.currentlyEditing = null;
        this.view.renderTasks(this.model.todoArr);
        input.removeEventListener("keydown", inputKeydown);
        approveButton.removeEventListener("click", approveClick);
      }
    };

    input.addEventListener("keydown", inputKeydown);

    input.addEventListener("blur", () => {
      approveClick();
      this.view.currentlyEditing = null;
      this.view.renderTasks(this.model.todoArr);
    });
  }

  saveTaskEdit(taskId, inputValue) {
    if (inputValue != "") {
      const task = this.model.todoArr.find((task) => task.id === taskId);
      if (task) {
        task.text = inputValue;
        this.view.currentlyEditing = null;
        this.view.renderTasks(this.model.todoArr);
        this.updateLocalStorage();
      }
    } else this.view.renderTasks(this.model.todoArr);
  }
}
