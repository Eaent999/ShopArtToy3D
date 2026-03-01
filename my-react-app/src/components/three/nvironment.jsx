import React from 'react';
import { Environment, ContactShadows, Lightformer } from '@react-three/drei';

const SceneEnvironment = () => {
  return (
    <>
      {/* 1. แสงสว่างพื้นฐาน (Ambient Light) */}
      <ambientLight intensity={0.5} />
      
      {/* 2. แสงส่องสว่างหลัก (Spotlight) ให้เกิดมิติ */}
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-amber={0.5} castShadow />

      {/* 3. การตั้งค่าสภาพแวดล้อม (Environment / HDRI) */}
      <Environment preset="city">
        {/* เพิ่ม Lightformer เพื่อสร้างแสงสะท้อนสีขาวเส้นยาวๆ บนโมเดล (เหมือนไฟสตูดิโอ) */}
        <Lightformer 
          form="rect" 
          intensity={1} 
          position={[-5, 2, -1]} 
          scale={[10, 5, 1]} 
          onBeforeRender={(self) => self.lookAt(0, 0, 0)} 
        />
      </Environment>

      {/* 4. เงาตกกระทบที่พื้น (Contact Shadows) ทำให้โมเดลไม่ดูเหมือนลอยอยู่ในอากาศ */}
      <ContactShadows 
        position={[0, -1.4, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2.5} 
        far={4} 
      />
    </>
  );
};

export default SceneEnvironment;