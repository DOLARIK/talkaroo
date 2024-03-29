import { OrbitControls } from "@react-three/drei";
import {Avatar} from "@/components/chat/chat-2/chat/avatar";

export const Experience = ({isTalking}) => {
  return (
    <>
    {/* <Avatar position={[0, -3, 5]} scale={2}/> */}
    <Avatar   isTalking={isTalking}  scale={[8, 8, 8]}
          position={[0, -12, 0]}/>
    </>
  );
};