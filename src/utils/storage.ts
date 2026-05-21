import { Todo } from '../types/todo';

const STORAGE_KEY = 'todos';
const SEEDED_KEY = 'todos_seeded';

export const SEED_TODOS: Todo[] = [
  {
    id: 'seed-001',
    title: 'Set up Tauri v2 project structure',
    completed: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-002',
    title: 'Implement localStorage persistence layer',
    completed: true,
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-003',
    title: 'Write unit tests with Vitest and Testing Library',
    completed: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-004',
    title: 'Configure GitHub Actions CI pipeline',
    completed: true,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-005',
    title: 'Add NeoLoad functional tests in neoload/functional/',
    completed: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-006',
    title: 'Configure NeoLoad load test scenarios',
    completed: false,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-007',
    title: 'Set up issue-triggered test triage workflow',
    completed: false,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-008',
    title: 'Demo GitHub Copilot unit test auto-generation',
    completed: false,
    createdAt: Date.now(),
  },
];

export function loadTodos(): Todo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      return JSON.parse(data);
    }
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(SEEDED_KEY, '1');
      saveTodos(SEED_TODOS);
      return SEED_TODOS;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
