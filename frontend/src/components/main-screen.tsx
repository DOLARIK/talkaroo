"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdMenu } from "react-icons/md";

import Dashboard from "./dashboard";
import ChatCard from "./chat/chat-card";
import { VoiceCard } from "./chat/voice-card";
import ChatBotCanvas from "./chat/chatbot-canvas";
import { useAuth } from "@/context/authContext.js";

function MainScreen() {


  const {user, googleSignIn} = useAuth();


  if (!user)
    return (
      <div>
        <div className="flex items-center justify-center h-[80vh]">
          <div>
            <h1 className="text-4xl font-semibold text-center">
              Welcome to AI Chat
            </h1>
            <div className="text-center">Your AI confidant</div>
            <div className="flex items-center justify-center mt-4">
              <Image
                src="/ai_message_logo.png"
                alt="AI Chat"
                width={400}
                height={400}
              />
            </div>

            <h2 className="text-2xl font-semibold text-center mt-4">
              Please login to continue
            </h2>
            <div className="flex items-center justify-center mt-4">
              <Button
                size={"lg"}
                onClick={() => {
                  googleSignIn();
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <VoiceCard />
      {/* <ChatCard /> */}
      
    </div>
  );
}

export default MainScreen;
