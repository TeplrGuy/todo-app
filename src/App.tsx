import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { FilterType } from './types/todo';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';

const FILTERS: FilterType[] = ['all', 'active', 'completed'];

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');

  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>

      <div className="stats">
        <span>Total: {total}</span>
        <span>Completed: {completedCount}</span>
        <span>Pending: {pendingCount}</span>
      </div>

      <AddTodo onAdd={addTodo} />

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <TodoList
        todos={filtered}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />

      <footer className="app-footer">
        <button
          className="clear-btn"
          onClick={clearCompleted}
          disabled={completedCount === 0}
        >
          Clear Completed ({completedCount})
        </button>
      </footer>
    </div>
  );
}

export default App;
