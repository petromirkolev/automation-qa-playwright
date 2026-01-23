export class ToDo {
  constructor(page) {
    this.page = page;
    this.loc = {
      taskInput: page.locator('[data-input="new-todo"]'),
      addButton: page.locator('[data-action="add-todo"]'),
      taskList: page.locator('.list-wrap'),
      filterTasks: page.locator('[data-input="filter-status"]'),
      sortTasks: page.locator('[data-input="sort"]'),
      clearCompletedTasks: page.locator('[data-action="clear-completed"]'),
      clearAllTasks: page.locator('[data-action="clear-all"]'),
      searchTask: page.locator('[data-input="search"]'),
      emptyView: page.locator('[data-view="empty"]'),
      taskRow: page.locator('.todo-item'),
    };
  }

  async add(title) {
    await this.loc.taskInput.fill(title);
    await this.loc.addButton.click();
  }

  async gotoFresh() {
    await this.page.goto('./');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
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

  getVisibleTitles = async () => {
    return (await this.page.locator('.todo-text').allTextContents()).map((t) =>
      t.trim(),
    );
  };
}
