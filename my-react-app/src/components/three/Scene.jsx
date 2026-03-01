import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows } from '@react-three/drei';
import SceneEnvironment from './Environment';
import Model from './Model'; // แยกส่วนการโหลดโมเดลออกมา
import LoadingSpinner from '../common/LoadingSpinner';

const Scene = ({ modelUrl }) => {
  return (
    <div className="w-full h-full min-h-[400px] relative bg-[#f8f8f8] rounded-3xl overflow-hidden">
      
      {/* 3D Canvas */}
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // ปรับความคมชัดตามหน้าจอ (Retina support)
      >
        {/* แสงและบรรยากาศ */}
        <SceneEnvironment />

        {/* ส่วนแสดงโมเดลสินค้า */}
        <Suspense fallback={null}>
          <Center top>
            <Model url={modelUrl} />
          </Center>
        </Suspense>

        {/* เงาที่พื้นแบบนุ่มนวล */}
        <ContactShadows 
          resolution={1024} 
          scale={6} 
          blur={2} 
          opacity={0.4} 
          far={10} 
          color="#000000" 
        />

        {/* ตัวควบคุมการหมุน */}
        <OrbitControls 
          makeDefault 
          enablePan={false} 
          minDistance={3} 
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Loading Overlay แสดงทับบน Canvas ขณะโหลดไฟล์ .glb */}
      <Suspense fallback={null}>
        <SceneLoader />
      </Suspense>
    </div>
  );
};

// Component ย่อยสำหรับเช็คสถานะการโหลด
const SceneLoader = () => {
  // ในอนาคตสามารถใช้ useProgress จาก @react-three/drei มาทำเปอร์เซ็นต์การโหลดได้
  return null; 
};

export default Scene;