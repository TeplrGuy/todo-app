import { useState, useCallback } from 'react';
import { Todo } from '../types/todo';
import { loadTodos, saveTodos } from '../utils/storage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => {
      const updated = [...prev, newTodo];
      saveTodos(updated);
      return updated;
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTodos(updated);
      return updated;
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTodos(updated);
      return updated;
    });
  }, []);

  const editTodo = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, title: trimmed } : t
      );
      saveTodos(updated);
      return updated;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => {
      const updated = prev.filter((t) => !t.completed);
      saveTodos(updated);
      return updated;
    });
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted };
}
