"use client";

import { useAuth } from '@/context/authContext';
import React, { useState } from 'react'
import { getTodos } from '@/lib/firebase/database';
import { set } from 'firebase/database';


function Todo() {
  const {user} = useAuth();
  
  const [todoList , setTodoList] = useState<any>([]);
  (getTodos(user?.uid)).then((data) => {
    setTodoList(data);
  });



  return (
    <div>
      <h1>Todo</h1>
      <ul>
        {todoList.map((todo:any) => {
          return <li key={todo.message}>{todo.message}</li>
        })}
      </ul>
    </div>
  )
}

export default Todo