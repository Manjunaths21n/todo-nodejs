import './todo-item.css';
import type { ITodoItem } from '../App';

interface ITodoItemProps {
    item: ITodoItem;
    index: number;
    onDelete: (id: string) => void;
    onUpdateStatus: (item: ITodoItem, status: ITodoItem['status']) => void;
}

export const TodoItem = ({ item, onDelete, onUpdateStatus }: ITodoItemProps) => (
    <div className='todo-item-container'>
        <li>{item.todo}</li>
        <div className="status-controls">
            <select
                value={item.status}
                onChange={(e) => onUpdateStatus(item, e.target.value as ITodoItem['status'])}
                className={`status-select ${item.status}`}
            >
                <option value="todo" className="option-yet-to-start">Yet to Start</option>
                <option value="in-progress" className="option-active">Active</option>
                <option value="done" className="option-completed">Completed</option>
            </select>
            <button
                onClick={() => onDelete(item.id)}
                className="delete-button"
                aria-label="Delete"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    </div>
);