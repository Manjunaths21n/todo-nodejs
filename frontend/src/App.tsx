import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { TodoItem } from './parts';

// const serviceUrl = 'http://localhost:4000/api';
const serviceUrl = import.meta.env.VITE_API_URL ?? (
  import.meta.env.MODE === 'development' ?
    'http://localhost:4000/api' :
    'https://todo-nodejs-b4x0.onrender.com/api'
);

import { ApiService } from './service-layer/service';

const apiService = new ApiService(serviceUrl);

export interface ITodoItem {
  todo: string;
  status: 'todo' | 'in-progress' | 'done';
  id: string;
}

function App() {
  const [todos, setTodos] = useState<ITodoItem[]>([]);
  const originalTodosRef = useRef<ITodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const loadTodos = useCallback(async () => {
    try {
      const res = await apiService.get('todos');
      console.log('Fetched todos:', res);
      const refinedResponse: ITodoItem[] = res.map((todo: { todo: string; status?: string, _id?: string }) => {
        const status = todo.status || 'todo'; // Ensure status is set
        return {
          todo: todo.todo,
          status: status as ITodoItem['status'] | 'todo',
          id: todo._id
        }
      });
      setTodos(refinedResponse);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }, []);
  useEffect(() => {
    loadTodos();
  }, []);


  const onAddTodo = useCallback(async () => {
    if (inputValue.trim()) {
      const newTodo = {
        todo: inputValue,
        status: 'todo' as const,
      };
      const addTodoResponse = await apiService.post('todos', newTodo);
      const newAddedTodo = addTodoResponse.todo;
      console.log('newAddedTodo:', newAddedTodo);
      const responseNewTodo: ITodoItem = { todo: newAddedTodo.todo, status: newAddedTodo.status, id: newAddedTodo._id };
      setTodos(prevState => {
        const newTodos = [...prevState, responseNewTodo];
        originalTodosRef.current = newTodos;
        return newTodos;
      });
      setInputValue('');
    }
  }, [inputValue]);

  const onClearSearch = useCallback(() => {
    setTodos(originalTodosRef.current);
    setSearchValue('');
  }, []);

  const updateTodoStatus = useCallback(async (modifiedItem: ITodoItem, newStatus: ITodoItem['status']) => {
    await apiService.update(`todos/${modifiedItem.id}`, { ...modifiedItem, status: newStatus });
    setTodos(preState => {
      const updatedTodos = [...preState];
      const index = preState.findIndex((({ id }) => id === modifiedItem.id));
      updatedTodos[index] = {
        ...updatedTodos[index],
        status: newStatus
      };
      originalTodosRef.current = updatedTodos;
      return updatedTodos;
    });
  }, []);

  const filterTodos = useCallback((status: ITodoItem['status'] | 'all') => {
    if (status === 'all') {
      setTodos(originalTodosRef.current);
    } else {
      setTodos(originalTodosRef.current.filter(todo => todo.status === status));
    }
  }, []);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
    if (searchValue) {
      setTodos(originalTodosRef.current.filter(todoItem =>
        todoItem.todo.includes(searchValue)
      ));
    } else {
      setTodos(originalTodosRef.current);
    }
  }, []);

  const onDeleteTodo = useCallback(async (id: string) => {
    if (id) {
      await apiService.delete(`todos/${id}`);
    }
    await loadTodos();
  }, []);

  return (
    <div className='app-container'>
      <div className='input-container'>
        <input className='todo-input' type="text" placeholder="Enter your name" value={inputValue} onChange={onInputChange} />
        <button className="todo-button add-button" onClick={onAddTodo}>
          Add Task
        </button>
      </div>
      <div className='search-container'>
        <input className='todo-search' type="text" placeholder="Search" value={searchValue} onChange={onSearchChange} />
        <button className="todo-button clear-search-button" onClick={onClearSearch}>
          Clear
        </button>
      </div>
      <div className='filter-group'>
        <button className='todo-button filter-button active' onClick={() => filterTodos('all')}>All</button>
        <button className='todo-button yet-to-start-button' onClick={() => filterTodos('todo')}>Yet to Start</button>
        <button className='todo-button active-button' onClick={() => filterTodos('in-progress')}>Active</button>
        <button className='todo-button completed-button' onClick={() => filterTodos('done')}>Completed</button>
      </div>
      <ul>
        {todos.map((item, index) => (
          <TodoItem
            key={index}
            item={item}
            index={index}
            onDelete={onDeleteTodo}
            onUpdateStatus={updateTodoStatus}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
