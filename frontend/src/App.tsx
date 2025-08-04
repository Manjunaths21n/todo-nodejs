import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { TodoItem } from './parts';
import { EditorRenderer } from './editor';

const serviceUrl = 'http://localhost:8888';

const fetchTodos = async () => {
  const response = await fetch(`${serviceUrl}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

import { ApiService } from './service-layer/service';

const apiService = new ApiService(serviceUrl);

// import React from 'react';

// export { apiService };



function App() {
  const [todo, setTodo] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showEditor, setShowEditor] = useState<boolean>(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
         await apiService.post<string[]>('/todos', { name: 'test' });
        const res = await apiService.get<string[]>('/todos');
        console.log('Fetched todos:', res);
        // const todos = await fetchTodos();
        // setTodo(todos);
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };
    loadTodos();
  }, []);


  const onAddTodo = useCallback(() => {
    setTodo(preState => {
      const newTodo = [...preState, inputValue];
      setInputValue('');
      return newTodo;
    })
  }, [inputValue]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const onDeleteTodo = useCallback((index: number) => {
    setTodo(preState => preState.filter((_, i) => i !== index));
  }, []);

  return (
    <div className='app-container'>
      <div className='input-container'>
        <input className='todo-input' type="text" placeholder="Enter your name" value={inputValue} onChange={onInputChange} />
        <button onClick={onAddTodo}>Enter</button>
      </div>
      <input className='todo-search' type="text" placeholder="Search" value={inputValue} onChange={onInputChange} />
      <div className='filter-container'>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </div>
      <ul>
        {todo.map((item, index) => (
          <TodoItem index={index} item={item} onDelete={onDeleteTodo} />
        ))}
      </ul>
      <button data-testid={'toggle-editor'} onClick={() => {
        console.log(window?.monaco?.editor?.getModels());
        console.log(window?.monaco?.editor?.getEditors()); setShowEditor(!showEditor);
      }} >'Toggle Editor' </button>
      {showEditor && <EditorRenderer />}
    </div>
  )
}

export default App
