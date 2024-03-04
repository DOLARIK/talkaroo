"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import type { message } from "@/types/messages";
import { aiAvatar } from "@/constants/constants";
import ChatMessage from "./chat-message";

interface ChatCardProps {
  messages: message[];
  isRecording: boolean;
  transcript: string;
}

function ChatCard({ messages, isRecording, transcript }: ChatCardProps) {

  const [message, setMessage] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);


  return (
    <div>
    
      <div className="flex max-h-screen items-center justify-center">
        <Card className="w-[700px] h-[700px] grid grid-rows-[min-content_1fr_min-content]">
          <CardHeader>
            <CardTitle>Talkaroo</CardTitle>
            <CardDescription>
              Chat with Talkaroo, your AI confidant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-scroll">
            {messages.map((msg: message, index) => (
              <ChatMessage
                key={index}
                avatarSource={msg.avatarSource}
                avatarFallback={msg.avatarFallback}
                name={msg.name}
                message={msg.message}
              />
            ))}
          </CardContent>
          <CardFooter className="space-x-2">
            <Input placeholder="How can I help you?"  />
            <Button >Send</Button>
          </CardFooter>
        </Card>
      </div> 
    </div>
  );
}

export default ChatCard;
