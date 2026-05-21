import { describe, it, expect, beforeEach } from 'vitest';
import { loadTodos, saveTodos } from '../utils/storage';
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

  it('loadTodos returns [] when storage is empty', () => {
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
});
