import React from 'react';
import { useGLTF, Center } from '@react-three/drei';

const Model = ({ url }) => {
  // ใช้ useGLTF เพื่อโหลดโมเดล 3D
  // ในโปรเจกต์จริง url จะเป็น path เช่น '/models/labubu.glb'
  const { scene } = useGLTF(url || '/models/default_box.glb');

  return (
    <Center top>
      <primitive 
        object={scene} 
        scale={1.5} 
        rotation={[0, Math.PI / 4, 0]} 
      />
    </Center>
  );
};

// Pre-load เพื่อให้โหลดเร็วขึ้น
// useGLTF.preload('/models/default_box.glb');

export default Model;