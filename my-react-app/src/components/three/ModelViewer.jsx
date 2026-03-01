import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, PerspectiveCamera, Center } from '@react-three/drei';
import LoadingSpinner from '../common/LoadingSpinner';

// ส่วนของตัวโมเดลสินค้า
const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  
  // ปรับแต่งโมเดลเพิ่มเติมที่นี่ได้ เช่น เงา หรือตำแหน่งเริ่มต้น
  return <primitive object={scene} scale={1.5} />;
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <div className="w-full h-[400px] md:h-[600px] bg-gradient-to-b from-gray-50 to-white rounded-3xl overflow-hidden relative">
      
      {/* ส่วนติดต่อผู้ใช้เล็กๆ เหนือ Canvas */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-lg shadow-sm border border-gray-100 text-[10px] font-bold text-gray-400">
          หมุนได้ 360° | ซูมได้
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        {/* มุมกล้อง */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* ระบบจัดการแสงและฉากหลังอัตโนมัติ (Stage) */}
        <Suspense fallback={null}>
          <Stage 
            environment="city" 
            intensity={0.5} 
            contactShadow={{ opacity: 0.4, blur: 2 }}
            adjustCamera={true}
          >
            <Center>
               <Model url={modelUrl} />
            </Center>
          </Stage>
        </Suspense>

        {/* ระบบควบคุมการหมุนด้วยเมาส์/นิ้ว */}
        <OrbitControls 
          enablePan={false} // ปิดการเลื่อนกล้องไปข้างๆ เพื่อให้โฟกัสที่ตัวสินค้า
          minPolarAngle={Math.PI / 4} // ล็อกไม่ให้ก้มต่ำเกินไป
          maxPolarAngle={Math.PI / 1.5} // ล็อกไม่ให้เงยสูงเกินไป
          autoRotate={true} // ให้หมุนเองเบาๆ
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* แสดง Loading เมื่อไฟล์ยังโหลดไม่เสร็จ */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <Suspense fallback={<LoadingSpinner label="กำลังเตรียมโมเดล 3D..." />} />
      </div>
    </div>
  );
};

// ป้องกัน Memory Leak ด้วยการ Pre-load โมเดล
useGLTF.preload = (url) => useGLTF.preload(url);

export default ModelViewer;