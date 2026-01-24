# Test Plan — Odin Todo (Playwright)

## Target

[https://petromirkolev.github.io/js-foundations-projects/projects/odin-todo/index.html](https://petromirkolev.github.io/js-foundations-projects/projects/odin-todo/index.html)

## Smoke

- **Load page renders core controls:** new task input, add button, and task list (or empty state) are visible.
- **Create task adds a visible row:** add a task (e.g., "Book") and verify it appears in the list.
- **Toggle complete updates UI state:** mark a task completed and verify the row gains the "completed" class; toggle again removes it.
- **Edit task updates title:** edit a task title and verify the updated text is shown.
- **Delete task removes only that row:** delete a task and verify it no longer exists in the list.

---

## Core flows

- **Filter: All / Active / Completed shows correct subsets:** items appear/disappear based on completion state and selected filter.
- **Search: substring match returns expected tasks:** search query narrows the list to matching task titles.
- **Search: no matches shows empty/no-results state:** search for a non-existing term and verify the UI indicates no results.
- **Sort: Text A→Z renders correct order:** tasks are displayed in ascending alphabetical order.
- **Sort: Text Z→A renders correct order:** tasks are displayed in descending alphabetical order.
- **Sort: Newest→Oldest renders correct order:** tasks are displayed by creation time (as defined by the app).
- **Sort: Oldest→Newest renders correct order:** tasks are displayed by creation time (as defined by the app).
- **Completed state survives sorting:** completed tasks remain completed after any sort operation.
- **Clear actions work**
  - **Clear completed:** removes only completed tasks.
  - **Clear all:** removes all tasks and shows the empty state.
- **Clearing search restores full list:** clearing the search input restores the full set of tasks (and keeps current sort/filter state if applicable).
- **Sort selection persists after clearing search:** sort remains applied after clearing the search query.

---

## Validation & isolation (edge cases)

- **Add via Enter key:** pressing Enter in the input creates a task (same outcome as clicking Add).
- **Reject empty input:** empty/whitespace-only input does not create a task.
- **Trim input** leading/trailing whitespace is removed (e.g., " Book " becomes "Book").
- **Edit affects only targeted task:** editing one task does not change other tasks.
- **Cancel edit leaves original text:** canceling an edit keeps the original title.
- **Reject empty edit:** empty/whitespace-only edits are not accepted; original title remains.
- **Delete affects only targeted task:** deleting one task does not remove other tasks.
- **Delete middle item keeps neighbors:** with A/B/C present, deleting B leaves A and C intact.
- **Complete toggle affects only targeted task:** toggling completion on one task does not affect others.
- **Complete toggle is reversible:** toggling completion twice returns the task to uncompleted state.
