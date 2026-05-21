import { useState, KeyboardEvent } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(todo.id, editValue.trim());
    }
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(todo.title);
      setEditing(false);
    }
  };

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.title}`}
      />
      {editing ? (
        <input
          className="todo-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Edit todo"
        />
      ) : (
        <span className="todo-title">{todo.title}</span>
      )}
      <div className="todo-actions">
        {editing ? (
          <button className="btn-save" aria-label="Save" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button
            className="btn-edit"
            onClick={() => {
              setEditValue(todo.title);
              setEditing(true);
            }}
            aria-label={`Edit ${todo.title}`}
          >
            Edit
          </button>
        )}
        <button
          className="btn-delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.title}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
