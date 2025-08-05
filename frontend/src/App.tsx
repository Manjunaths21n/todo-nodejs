import { useCallback, useRef, useState } from 'react'
import './App.css'
import { TodoItem } from './parts';
// import { EditorRenderer } from './editor';

// const serviceUrl = 'http://localhost:8888';

// const fetchTodos = async () => {
//   const response = await fetch(`${serviceUrl}/todos`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch todos');
//   }
//   return response.json();
// }

// import { ApiService } from './service-layer/service';

// const apiService = new ApiService(serviceUrl);

// import React from 'react';

// export { apiService };

export interface ITodoItem {
  text: string;
  status: 'yet-to-start' | 'active' | 'completed';
}

function App() {
  const [todos, setTodos] = useState<ITodoItem[]>([]);
  const originalTodosRef = useRef<ITodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  // useEffect(() => {
  //   const loadTodos = async () => {
  //     try {
  //       await apiService.post<string[]>('/todos', { name: 'test' });
  //       const res = await apiService.get<string[]>('/todos');
  //       console.log('Fetched todos:', res);
  //       // const todos = await fetchTodos();
  //       // setTodo(todos);
  //     } catch (error) {
  //       console.error('Error loading todos:', error);
  //     }
  //   };
  //   loadTodos();
  // }, []);


  const onAddTodo = useCallback(() => {
    if (inputValue.trim()) {
      setTodos(prevState => {
        const newTodo = {
          text: inputValue,
          status: 'yet-to-start' as const
        };
        const newTodos = [...prevState, newTodo];
        originalTodosRef.current = newTodos;
        setInputValue('');
        return newTodos;
      });
    }
  }, [inputValue]);

  const onClearSearch = useCallback(() => {
    setTodos(originalTodosRef.current);
    setSearchValue('');
  }, []);

  const updateTodoStatus = useCallback((index: number, newStatus: ITodoItem['status']) => {
    setTodos(prevState => {
      const updatedTodos = [...prevState];
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
        todoItem.text.includes(searchValue)
      ));
    } else {
      setTodos(originalTodosRef.current);
    }
  }, []);

  const onDeleteTodo = useCallback((index: number) => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.filter((_, i) => i !== index);
      originalTodosRef.current = newTodos; // Update the reference
      return newTodos;
    });
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
        <button className='todo-button yet-to-start-button' onClick={() => filterTodos('yet-to-start')}>Yet to Start</button>
        <button className='todo-button active-button' onClick={() => filterTodos('active')}>Active</button>
        <button className='todo-button completed-button' onClick={() => filterTodos('completed')}>Completed</button>
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
