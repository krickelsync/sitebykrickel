import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

interface ModelProps {
  isHovered: boolean;
}

const GLB_URL = 'https://pgppgdlkoblmpqdyfxfc.supabase.co/storage/v1/object/public/logo//untitled1%20(1).glb';

const Model = ({ isHovered }: ModelProps) => {
  const { scene } = useGLTF(GLB_URL);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Auto-rotate
      const rotationSpeed = isHovered ? 0.03 : 0.01;
      modelRef.current.rotation.y += rotationSpeed;

      // Floating animation (up and down)
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;

      // Scale effect on hover
      const targetScale = isHovered ? 1.15 : 1;
      modelRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
};

// Preload the model for better performance
useGLTF.preload(GLB_URL);

const Logo3D = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#CCFF00" />
        <Suspense fallback={null}>
          <Model isHovered={isHovered} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default Logo3D;
