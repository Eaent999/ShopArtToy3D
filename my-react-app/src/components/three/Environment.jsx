import { Environment, ContactShadows } from '@react-three/drei';

const SceneEnvironment = () => {
  return (
    <>
      {/* สีพื้นหลังของ Canvas */}
      <color attach="background" args={['#f8f8f8']} />
      
      {/* แสงสว่างจากสิ่งแวดล้อม (HDRI) */}
      <Environment preset="city" />
      
      {/* แสงพื้นฐานเพื่อให้เห็นรายละเอียดโมเดล */}
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} castShadow />
    </>
  );
};

export default SceneEnvironment;