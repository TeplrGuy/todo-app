import { describe, it, expect, beforeEach } from 'vitest';
import { loadTodos, saveTodos, SEED_TODOS } from '../utils/storage';
import { Todo } from '../types/todo';

const mockTodo: Todo = {
  id: '1',
  title: 'Test todo',
  completed: false,
  createdAt: 1000,
};

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadTodos seeds data on very first load (no prior storage)', () => {
    const todos = loadTodos();
    expect(todos).toEqual(SEED_TODOS);
    expect(todos.length).toBe(SEED_TODOS.length);
  });

  it('loadTodos returns [] when storage is empty but already seeded', () => {
    localStorage.setItem('todos_seeded', '1');
    expect(loadTodos()).toEqual([]);
  });

  it('loadTodos parses stored data correctly', () => {
    localStorage.setItem('todos', JSON.stringify([mockTodo]));
    expect(loadTodos()).toEqual([mockTodo]);
  });

  it('saveTodos stores todos in localStorage', () => {
    saveTodos([mockTodo]);
    const stored = localStorage.getItem('todos');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual([mockTodo]);
  });

  it('loadTodos handles invalid JSON gracefully', () => {
    localStorage.setItem('todos', 'not-valid-json{{{');
    expect(loadTodos()).toEqual([]);
  });

  it('saveTodos overwrites existing data', () => {
    saveTodos([mockTodo]);
    const updated = { ...mockTodo, title: 'Updated' };
    saveTodos([updated]);
    expect(loadTodos()).toEqual([updated]);
  });

  it('SEED_TODOS contains both completed and active items', () => {
    const completed = SEED_TODOS.filter((t) => t.completed);
    const active = SEED_TODOS.filter((t) => !t.completed);
    expect(completed.length).toBeGreaterThan(0);
    expect(active.length).toBeGreaterThan(0);
  });

  it('SEED_TODOS items have unique ids', () => {
    const ids = SEED_TODOS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
