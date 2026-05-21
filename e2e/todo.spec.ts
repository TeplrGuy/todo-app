import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1420');
  });

  test('displays the app header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  });

  test('shows empty state message when no todos', async ({ page }) => {
    await expect(page.getByText('No todos here!')).toBeVisible();
  });

  test('can add a new todo', async ({ page }) => {
    await page.getByLabel('New todo').fill('Buy groceries');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('can toggle todo completion', async ({ page }) => {
    await page.getByLabel('New todo').fill('Read a book');
    await page.getByRole('button', { name: 'Add' }).click();
    const checkbox = page.getByLabel(/Toggle Read a book/);
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('can delete a todo', async ({ page }) => {
    await page.getByLabel('New todo').fill('Delete me');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: /Delete Delete me/ }).click();
    await expect(page.getByText('Delete me')).not.toBeVisible();
  });

  test('can edit a todo', async ({ page }) => {
    await page.getByLabel('New todo').fill('Original title');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: /Edit Original title/ }).click();
    const editInput = page.getByLabel('Edit todo');
    await editInput.clear();
    await editInput.fill('Updated title');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Updated title')).toBeVisible();
  });

  test('filters todos by active/completed', async ({ page }) => {
    await page.getByLabel('New todo').fill('Active todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('New todo').fill('Done todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel(/Toggle Done todo/).click();

    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByText('Active todo')).toBeVisible();
    await expect(page.getByText('Done todo')).not.toBeVisible();

    await page.getByRole('button', { name: 'Completed' }).click();
    await expect(page.getByText('Done todo')).toBeVisible();
    await expect(page.getByText('Active todo')).not.toBeVisible();
  });

  test('clear completed removes completed todos', async ({ page }) => {
    await page.getByLabel('New todo').fill('Keep me');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('New todo').fill('Clear me');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel(/Toggle Clear me/).click();

    await page.getByRole('button', { name: /Clear Completed/ }).click();
    await expect(page.getByText('Keep me')).toBeVisible();
    await expect(page.getByText('Clear me')).not.toBeVisible();
  });

  test('shows correct stats', async ({ page }) => {
    await page.getByLabel('New todo').fill('First');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('New todo').fill('Second');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel(/Toggle First/).click();

    await expect(page.getByText('Total: 2')).toBeVisible();
    await expect(page.getByText('Completed: 1')).toBeVisible();
    await expect(page.getByText('Pending: 1')).toBeVisible();
  });
});
