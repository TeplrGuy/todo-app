import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../../components/TodoItem';
import { Todo } from '../../types/todo';

const mockTodo: Todo = {
  id: '1',
  title: 'Test todo',
  completed: false,
  createdAt: Date.now(),
};

const completedTodo: Todo = { ...mockTodo, completed: true };

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('renders unchecked checkbox for incomplete todo', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders checked checkbox for completed todo', () => {
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('enters edit mode when edit button is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('textbox', { name: /edit todo/i })).toBeInTheDocument();
  });

  it('calls onEdit with new title when saved', async () => {
    const onEdit = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={onEdit}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    const input = screen.getByRole('textbox', { name: /edit todo/i });
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated title');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onEdit).toHaveBeenCalledWith('1', 'Updated title');
  });

  it('cancels edit on Escape key', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('textbox', { name: /edit todo/i })).not.toBeInTheDocument();
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('applies completed class for completed todo', () => {
    const { container } = render(
      <TodoItem
        todo={completedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    expect(container.querySelector('.todo-item')).toHaveClass('completed');
  });
});
