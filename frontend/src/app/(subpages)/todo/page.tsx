"use client";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import EmptyTodo from "@/components/todo/empty-todo";
import TodoItem from "@/components/todo/todo-item";
import { Button } from "@/components/ui/button";
import { For, Show, useObservable, Reactive } from "@legendapp/state/react";


import type { Todo } from "@/types/todo";
import { Status } from "@/types/todo";
import { CInput } from "@/components/ui/cinput";
import { state } from "@/store/todo";
import Navbar from "@/components/navbar";
import { toast } from "sonner";

enableReactUse();
enableReactComponents();

export default function Todo() {
  const input = useObservable("");

  const handleSave = () => {
    if (input.get().trim() === ""){
      toast.error("Please enter a todo");
      return;
    }
    state.todos.push({
      id: crypto.randomUUID(),
      status: Status.Initialized,
      text: input.get(),
    });
    input.set("");
  };

    return (
      <div>
        <Navbar />
        {/* add header */}
        <h1 className="text-3xl font-semibold text-center pt-4 underline">Todo</h1>


        <section className="flex w-full max-w-lg  mx-auto items-center space-x-2 justify-center mt-8">
        <CInput
          type="text"
          placeholder="Start typing..."
          autoFocus
          $value={input}
          onSubmit={handleSave}
        />

        <Button size={"lg"} onClick={handleSave}>Save</Button>
      </section>

      <section className="mt-8 max-w-lg mx-auto">
        <div className="flex flex-col gap-y-2">
          <For each={state.todos}>
            {(todo) => <TodoItem todo={todo.get() as Todo} />}
          </For>
        </div>
      </section>      


        
      </div>
    );
  
}
