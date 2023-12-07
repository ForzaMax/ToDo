// В модели только наши данные
export const LS_TODO_KEY = "tasks";

export class taskModel {
  constructor() {
    this.todoArr = JSON.parse(localStorage.getItem(LS_TODO_KEY)) ?? [];
  }
}
