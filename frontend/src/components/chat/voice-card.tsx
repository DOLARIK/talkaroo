//1. Import necessary hooks and types from React
"use client";
import { useEffect, useState, useRef } from "react";
import ChatCard from "./chat-card";
import { message } from "@/types/messages";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import ChatMessage from "./chat-message";
import { addMessageToArray } from "@/database/firebase";


//2. Extend Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

//3. Main functional component declaration
export function VoiceCard() {
  const { user } = useUser();

  //4. State hooks for various functionalities
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");

  const [messages, setMessages] = useState<message[]>([]);

  //5. Ref hooks for speech recognition and silence detection
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  //7. Asynchronous function to handle backend communication
  const sendToBackend = async (message: string, modelKeyword?: string): Promise<void> => {
    setIsLoading(true);

    messages.push({ name: user?.name ?? "You", message: message, avatarSource: user?.picture ?? "", avatarFallback: "YOU" });
    addMessageToArray(user?.email ?? "", message);

    try {
      //7.1 Stop recording before sending data
      stopRecording();
      //7.2 Send POST request to backend
      //TODO FIX THIS API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, model: modelKeyword }),
      });
      //7.3 Check for response validity
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      //7.4 Process and play audio response if available
      const data = await response.json();
      if (data.data && data.contentType === "audio/mp3") {
        const audioSrc = `data:audio/mp3;base64,${data.data}`;
        const audio = new Audio(audioSrc);
        setIsPlaying(true);
        audio.play();
        audio.onended = () => {
          setIsPlaying(false);
          startRecording();
        };
      }
    } catch (error) {
      //7.5 Handle errors during data transmission or audio playback
      console.error("Error sending data to backend or playing audio:", error);
    }
    setIsLoading(false);
  };


  //9. Process speech recognition results
  const handleResult = (event: any): void => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      interimTranscript += event.results[i][0].transcript;
    }
    setTranscript(interimTranscript);
    setInputValue(interimTranscript);
    silenceTimerRef.current = setTimeout(() => {
      //9.1 Extract and send detected words to backend
      const words = interimTranscript.split(" ");
      //TODO ADD USER ID
      sendToBackend(interimTranscript, );
      setTranscript("");
      setInputValue("");
    }, 2000);
  };

  //10. Initialize speech recognition
  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setResponse("");
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = handleResult;
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    recognitionRef.current.start();
  };

  //11. Clean up with useEffect on component unmount
  useEffect(
    () => () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    },
    []
  );

  //12. Function to terminate speech recognition
  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  //13. Toggle recording state
  const handleToggleRecording = () => {
    if (!isRecording && !isPlaying) startRecording();
    else if (isRecording) stopRecording();
  };

  //14. Main component rendering method
  return (
    //14.1 Render recording and transcript status
    <main >

      {/* 14.2 Render model selection and recording button */}
      <div className="w-full min-h-max bg-slate-200">
      <div className="flex flex-row">
              <button
                onClick={handleToggleRecording}
                className={`m-auto flex items-center justify-center ${
                  isRecording ? "bg-red-500 prominent-pulse" : "bg-blue-500"
                } rounded-full w-48 h-48 focus:outline-none`}
              />
              <div>
              <div>
    
    <div className="flex max-h-screen items-center justify-center">
      <Card className="w-[700px] h-[700px] grid grid-rows-[min-content_1fr_min-content]">
        <CardHeader>
          <CardTitle>Talkaroo</CardTitle>
          <CardDescription>
            Chat with Talkaroo, your AI confidant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Input placeholder="How can I help you?" disabled={isRecording} value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          />
          <Button disabled={isRecording} onClick={handleResult}>Send</Button>
        </CardFooter>
      </Card>
    </div> 
  </div>
              </div>
              </div>
      </div>
    </main>
  );
}