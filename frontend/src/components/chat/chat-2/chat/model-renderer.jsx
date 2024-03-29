'use client';

import { OrbitControls, Plane, useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Vector3 } from 'three'
import {Avatar} from './avatar'
import {Experience } from './experience'


export function Model( {isTalking}) {

  
  return (
    <div className='h-full rounded-xl w-full border max-h-[90vh]'>
      
      <Canvas className='h-full w-full rounded-xl'
      camera={{ position: [0, 0, 7], fov: 60}}
      >
        <color attach="background" args={['#fafafa']} />
        <OrbitControls
          enableZoom={true}
          enableDamping
          maxPolarAngle={1.8}
          minAzimuthAngle={-Math.PI * 0.5}
          maxAzimuthAngle={Math.PI * 0.5}
        />
        <ambientLight intensity={4} />
        <Experience isTalking={isTalking}/>
        
        {/* <primitive
          object={scene}

          scale={[8, 8, 8]}
          position={[0, -12, 0]}
        /> */}
      </Canvas>
    </div>
  );
}

