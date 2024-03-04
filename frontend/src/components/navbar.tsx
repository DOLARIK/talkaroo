"use client";
import ProfileClient from "./profile-client";
import { ModeToggle } from "./ui/mode-toggle";
import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { MdMenu } from "react-icons/md";
import Dashboard from "./dashboard";
import { Button } from "./ui/button";
import Image from 'next/image'



function Navbar() {

    return (
        <div className="grid grid-cols-2 h-20 border-b-2 border-black/20 ">
            <div className="flex items-center justify-start pl-4">
                <Image src={"/talkaroo-logo.jpg"} width={40} height={20} alt="talkaroo"/>

                <div className="text-primary text-xl font-semibold px-3">
                  Talkaroo
                </div>
            </div>
            
            <div className="flex items-center justify-end pr-4 gap-4">
                <ProfileClient />
                {/* <ModeToggle /> */}
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
