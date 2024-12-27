//1. Import necessary hooks and types from React
"use client";
import { useEffect, useState, useRef } from "react";
import ChatCard from "./chat-card";
import { message } from "@/types/messages";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import ChatMessage from "./chat-message";
// import { addMessageToArray } from "@/database/firebase";
import ChatBotCanvas from "./chatbot-canvas";
// import {user} from "@/constants/constants";
import { useAuth } from "@/context/authContext.js";


//2. Extend Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

//3. Main functional component declaration
export function VoiceCard() {
  //3.1 Get user details from context
  const user = useAuth();
 
  const userId = user?.uid ?? "";
 

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const voices = synth?.getVoices()
  

  const selectedVoices = voices?.find((voice) => voice.name === 'Karen');

  const speak = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoices!;
    utterance.rate = 1.2;
    synth?.speak(utterance);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
  }

  //4. State hooks for various functionalities
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");

  const [messages, setMessages] = useState<message[]>([]);

  //5. Ref hooks for speech recognition and silence detection
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);


  //7. Asynchronous function to handle backend communication
  const sendToBackend = async (message: string): Promise<void> => {
    setIsLoading(true);
    setIsSpeaking(true);

    messages.push({ name: user?.displayName ?? "You", message: message, avatarSource: user?.picture ?? "", avatarFallback: "YOU" });
    // addMessageToArray(user?.email ?? "", message);

    try {
      //7.1 Stop recording before sending data
      stopRecording();
      //7.2 Send POST request to backend

      // Log the API endpoint for debugging

      console.log('API Endpoint:', process.env.RESPONSE_CREATION_AGGREGATION_API);

      // ENDPOINT

      fetch('http://35.197.94.204:30500/ask' || 'http://localhost:30500/ask', {

  method: 'POST', // Method itself
  headers: {
    'Content-Type': 'application/json', // Indicates the content 
  },
  body: JSON.stringify({
    user_id: "user",
    ask: message +  "make the answer short but engaging"
  }) // Body data type must match "Content-Type" header
})
.then(response => response.json()) // Parses JSON response into native JavaScript objects
.then(data => {
  console.log(data);
  const response = data.response;
  speak(response);
  messages.push({ name: "AI Chat", message: response, avatarSource: "/talkaroo-icon.png", avatarFallback: "AI" });
  setMessages([...messages]);
  setResponse(response);
  setIsLoading(false);
})
.catch((error) => {
  console.error('Error:', error); // Handle the error
});
    } catch (error) {
        console.error(error)
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

  const handleSubmitChat = () => {
    sendToBackend(inputValue);
    setInputValue("");

  }

  //14. Main component rendering method
  return (
    //14.1 Render recording and transcript status
    <main >

      {/* 14.2 Render model selection and recording button */}
      <div className=" min-h-max ">
      <div className="flex flex-row">
        <div className="flex-col p-5 items-center h-max justify-center">
        <ChatBotCanvas isTalking={isSpeaking} />
        <div className="mt-20">
              <Button
                variant={"wmax"}
                onClick={handleToggleRecording}
                className={`${ isRecording }`}
                disabled={isRecording || isSpeaking}
              > {!isRecording? !isSpeaking ? <div>Speak to me</div>  : <div>Listen up</div> : <div>Listening...</div>} </Button>
              </div>
        </div>
        

              <div>
              <div>
    
    <div className="flex max-h-screen items-center justify-center">
      <Card className="w-[700px] h-[700px] grid grid-rows-[min-content_1fr_min-content]">
        <CardHeader>
          <CardTitle>AI Chat</CardTitle>
          <CardDescription>
            Chat with AI Chat, your AI confidant
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
          <Input placeholder="How can I help you?" disabled={isRecording || isSpeaking || isLoading} value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmitChat}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmitChat();
            }
          
          }
        }
          />
          <Button disabled={isRecording || isSpeaking || isLoading} onClick={handleSubmitChat}>Send</Button>
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
