"use client";
import React, { useEffect, useRef, useState } from 'react'
import {useAuth} from "@/context/authContext"
import { message } from '@/types/messages';
import { addMessageToUserArray } from '@/lib/firebase/database';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ChatMessage from './chat-message';
import {Model} from '@/components/chat/chat-2/chat/model-renderer';

declare global {
    interface Window {
      webkitSpeechRecognition: any;
    }
  }

export const ChatCard = () => {

    const {user} = useAuth();
    const userId = user?.uid;

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

    const synth = typeof window !== 'undefined' && window.speechSynthesis;
    const voices = synth ? synth?.getVoices() : [];


    const selectedVoices = voices?.find((voice: any) => voice.name === 'Karen');

    const speak = (text: string) => {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoices!;
        utterance.rate = 1;
        (synth as SpeechSynthesis)?.speak(utterance);
        utterance.onend = () => {
            setIsSpeaking(false);
        };
    }

    const sendToBackend = async (message: string): Promise<void> => {
        setIsLoading(true);
        setIsSpeaking(true);
    
        messages.push({ name: user?.name ?? "You", message: message, avatarSource: user?.picture ?? "", avatarFallback: "YOU" });
        addMessageToUserArray(userId!, message, true);
        try {
          //7.1 Stop recording before sending data
          stopRecording();
          //7.2 Send POST request to backend
    
          fetch('http://35.197.94.204:30500/ask', {
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
      messages.push({ name: "AiChat", message: response, avatarSource: "/ai_message_no_text.png", avatarFallback: "AI" });
      addMessageToUserArray(userId!, response, false);
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
    

  return (
    <div className='h-full w-full border rounded-xl flex'>
      <div className='h-full flex-1'>
    <Model isTalking={isSpeaking} />
  </div>
  <div className='h-full w-2/3 flex-2'>
    <Card className="grid grid-rows-[min-content_1fr_min-content] h-full">
      <CardHeader>
        <CardTitle>AiChat</CardTitle>
        <CardDescription>
          Chat with AiChat, your AI confidant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-scroll h-full">
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
        <Button
          onClick={handleToggleRecording}
          className={`${isRecording}`}
          disabled={isRecording || isSpeaking}
        >
          {!isRecording ? (
            !isSpeaking ? (
              <div>Speak to me</div>
            ) : (
              <div>Listen up</div>
            )
          ) : (
            <div>Listening...</div>
          )}
        </Button>

        <Input
          placeholder="How can I help you?"
          disabled={isRecording || isSpeaking || isLoading}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmitChat}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmitChat();
            }
          }}
        />
        <Button disabled={isRecording || isSpeaking || isLoading} onClick={handleSubmitChat}>
          Send
        </Button>
      </CardFooter>
    </Card>
  </div>
  
</div>
  )
}

export default ChatCard
