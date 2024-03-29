"use client";

import React from 'react'
import Navbar from './navbar';
import Image from 'next/image'
import { Button } from './ui/button';

function Dashboard() {
    

   const options = [ 
    {
        title: "Chat",
        description: "Chat with AI Chat",
        path: "/",
    },
    {
    title: "Todo",
    description: "Manage your tasks",
    path: "/todo",
   },
    {
     title: "Journal",
     description: "Write your thoughts",
     path: "/journal",
    },
    {
    
    
     title: "Wellbeing",
     description: "Track your wellbeing",
     path: "/",
    },
    {
      title: "Reports",
      description: "Get your reports from AI Chat",
      path: "/reports",
  },
]

    

  return (
    <div>

<div className="max-w-full flex flex-wrap flex-col justify-center items-center center-screen pt-5 gap-4">
      {options.map((option, index) => (
        <div
        onClick={() => {
            window.location.href = option.path;
        }}
          key={index}
          className="text-primary/90 justify-center text-center items-center bg-primary/10 rounded-md hover:bg-primary/30 transition-all ease-in-out duration-300 w-full h-28 flex cursor-pointer"
        >
            <div className='flex flex-col'>
            <h1 className='text-xl'>{option.title}</h1>
            <p className='text-sm text-muted-foreground'>{option.description}</p>
          </div>
        </div>
      ))}
    </div>

    </div>
  )
}

export default Dashboard
