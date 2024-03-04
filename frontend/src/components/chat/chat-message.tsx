import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { message } from "@/types/messages";


function ChatMessage(prop: message) {
  return (
    <div>
      <div className="flex gap-2 text-black/90 text-sm">
        <Avatar>
          <AvatarImage src={prop.avatarSource} />
          <AvatarFallback>{prop.avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="leading-relaxed">
          <span className="block font-bold ">{prop.name}:</span>
          {prop.message}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;
