import { useState, FormEvent } from 'react';

interface AddTodoProps {
  onAdd: (title: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new todo..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="New todo"
      />
      <button type="submit">Add</button>
    </form>
  );
}
