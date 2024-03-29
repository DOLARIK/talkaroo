import { Model } from "@/components/chat/chat-2/chat/model-renderer";
import { ChatCard } from "@/components/chat/chat-2/chat/chat-card";

export default function Root () {
  return (
    <div className="p-4 h-screen max-h-[90vh] flex flex-gap-2">
      
      <ChatCard />
    </div>
  )
}