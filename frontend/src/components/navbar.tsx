"use client";
import ProfileClient from "./profile-client";
import { ModeToggle } from "./ui/mode-toggle";
import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { MdMenu } from "react-icons/md";
import Dashboard from "./dashboard";
import { Button } from "./ui/button";
import Image from 'next/image'
import { useAuth } from "@/context/authContext";



function Navbar() {
    const  {googleSignIn, logOut,user} = useAuth();
    return (
        <div className="grid grid-cols-2 h-20 border-b-2 border-black/20 ">
            <div className="flex items-center justify-start pl-4">
                <Image src={"/ai_message_logo.png"} width={40} height={20} alt="AI Chat"/>

                <div className="text-primary text-xl font-semibold px-3">
                AI Chat
                </div>
            </div>
            
            <div className="flex items-center justify-end pr-4 gap-4">
                {user && "Hello, " + user.displayName }
                {user ? <Button onClick={logOut}>Sign out</Button> : <Button onClick={googleSignIn}>Login</Button>}
                <Sheet>
  <SheetTrigger>
    <Button size={"icon"} variant={"secondary"}> <MdMenu size={36} /> </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Choose where you want to go</SheetTitle>
      <SheetDescription>
        Choose from the options below
      </SheetDescription>
    </SheetHeader>
    <Dashboard />
  </SheetContent>
</Sheet>
            </div>            
         
        </div>
    );
}
 
export default Navbar;
