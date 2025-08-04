import { memo } from 'react';
import './todo-item.css';

interface TodoItemProps {
    item: string;
    index: number;
    onDelete: (index: number) => void;
}

export const TodoItem = memo(({ item, index, onDelete }: TodoItemProps) => {
    return <div className='todo-item-container'>
        <li>{item}</li>
        <button onClick={() => onDelete(index)}>
            Delete
        </button>
    </div>
});