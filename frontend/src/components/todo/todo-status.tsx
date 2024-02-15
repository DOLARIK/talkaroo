import { Status } from "@/types/todo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { state } from "@/store/todo"

export default function TodoStatus({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const handleChangeStatus = (status: Status) => {
    state.todos.set((todos: any) =>
      todos.map((todo : any) => {
        if (todo.id === id) {
          return {
            ...todo,
            status,
          };
        }
        return todo;
      })
    );
  };
  return (
    <Select
      defaultValue={Status.Initialized}
      value={status}
      onValueChange={(v: any) => handleChangeStatus(v as Status)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="initialized">Not Started</SelectItem>
        <SelectItem value="progress">In Progress</SelectItem>
        <SelectItem value="done">Competed</SelectItem>
      </SelectContent>
    </Select>
  );
}
