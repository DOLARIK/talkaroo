"use client";

import React from "react";
import { Button } from "./ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
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

function MainScreen() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>error</div>;

  if (!user)
    return (
      <div>
        <div className="flex items-center justify-center h-[80vh]">
          <div>
            <h1 className="text-4xl font-semibold text-center">
              Welcome to Talkaroo
            </h1>
            <div className="text-center">Your AI confidant</div>
            <div className="flex items-center justify-center mt-4">
              <Image
                src="/talkaroo-icon.png"
                alt="Talkaroo"
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
                  window.location.href = "/api/auth/login";
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
