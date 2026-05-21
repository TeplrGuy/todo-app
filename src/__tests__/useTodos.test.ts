import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';
import { saveTodos } from '../utils/storage';
import { Todo } from '../types/todo';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty list when storage is empty', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('initializes from localStorage', () => {
    const existing: Todo[] = [
      { id: 'abc', title: 'Existing', completed: false, createdAt: 100 },
    ];
    saveTodos(existing);
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual(existing);
  });

  it('addTodo adds a new item', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Buy milk');
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Buy milk');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('addTodo does not add empty strings', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('   ');
    });
    expect(result.current.todos).toHaveLength(0);
  });

  it('addTodo persists to localStorage', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Persisted');
    });
    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Persisted');
  });

  it('toggleTodo flips completed status', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Toggle me');
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.toggleTodo(id);
    });
    expect(result.current.todos[0].completed).toBe(true);
    act(() => {
      result.current.toggleTodo(id);
    });
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('deleteTodo removes the item', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Delete me');
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.deleteTodo(id);
    });
    expect(result.current.todos).toHaveLength(0);
  });

  it('editTodo updates the title', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Old title');
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.editTodo(id, 'New title');
    });
    expect(result.current.todos[0].title).toBe('New title');
  });

  it('editTodo ignores empty title', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Keep me');
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.editTodo(id, '   ');
    });
    expect(result.current.todos[0].title).toBe('Keep me');
  });

  it('clearCompleted removes only completed todos', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Active');
      result.current.addTodo('Done');
    });
    const doneId = result.current.todos[1].id;
    act(() => {
      result.current.toggleTodo(doneId);
    });
    act(() => {
      result.current.clearCompleted();
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Active');
  });
});
