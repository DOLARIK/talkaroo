"use client";
import {
	Environment,
	Html,
	Loader,
	OrbitControls,
	SpotLight,
	useAnimations,
	useDepthBuffer,
	useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useContext, useEffect, useRef } from "react";
import { Vector3 } from "three";

const Torch = ({ vec = new Vector3(), ...props }) => {
	const light = useRef<THREE.SpotLight>(null);
	const viewport = useThree((state) => state.viewport);
	useFrame((state) => {
		light.current?.target.position.lerp(
			vec.set(
				(state.pointer.x * viewport.width) / 2,
				(state.pointer.y * viewport.height) / 2,
				0
			),
			0.1
		);
		light.current?.target.updateMatrixWorld();
	});
	return (
		<SpotLight
			castShadow
			ref={light}
			penumbra={1}
			distance={10}
			angle={0.35}
			attenuation={5}
			anglePower={4}
			intensity={3}
			{...props}
		/>
	);
};

interface HeadProps {
  isTalking: boolean;
}
function Head({ isTalking }: HeadProps) {
  const model = useGLTF('/head.glb');
  const animation = useAnimations(model.animations, model.scene);
  const action = animation.actions.Animation;
  const depthBuffer = useDepthBuffer({ frames: 1 });
  // console.log(action);
  useEffect(() => {
		if (isTalking) {
			action?.play();
		} else {
			action?.fadeOut(0.5);
			setTimeout(() => {
				action?.stop();
			}, 500);
		}
	}, [isTalking, action]);
  return (
    <>
      <primitive object={model.scene} scale={5} rotation-z={0.2} />
      {/* <Torch
              depthBuffer={depthBuffer}
              color="white"
              position={[3, 2, 2]}
            />
            <Torch
              depthBuffer={depthBuffer}
              color="white"
              position={[-3, 2, 2]}
            /> */}
    </>
  );
}
 

interface ChatBotCanvasProps {
  isTalking: boolean;
}

function ChatBotCanvas({ isTalking }: ChatBotCanvasProps) {
  return (
    <div className='h-[500px] w-[500px]'>
        <Canvas>
          <OrbitControls enableZoom={false} enableDamping maxPolarAngle={1.8} minAzimuthAngle={-Math.PI * 0.5} maxAzimuthAngle={Math.PI * 0.5}/>
          <ambientLight intensity={24} />
              <Head isTalking={isTalking} />

        </Canvas>
    </div>
  )
}

export default ChatBotCanvas