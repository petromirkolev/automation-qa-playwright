export class ToDo {
  constructor(page) {
    this.page = page;
    this.loc = {
      taskInput: page.locator('[data-input="new-todo"]'),
      addButton: page.locator('[data-action="add-todo"]'),
      taskList: page.locator('.list-wrap'),
    };
  }

  async add(title) {
    await this.loc.taskInput.fill(title);
    await this.loc.addButton.click();
  }

  row(title) {
    return this.page.locator('.todo-item', {
      has: this.page.locator('.todo-text', { hasText: title }),
    });
  }

  toggleCompleted(title) {
    return this.row(title).locator('[data-action="toggle-completed"]');
  }

  editBtn(title) {
    return this.row(title).locator('[data-action="edit-todo"]');
  }

  deleteBtn(title) {
    return this.row(title).locator('[data-action="delete-todo"]');
  }
}
