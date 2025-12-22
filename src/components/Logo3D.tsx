import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

const MODEL_URL = 'https://cdn.shopify.com/3d/models/90eca49db58032ed/untitled1.glb';

interface ModelProps {
  isHovered: boolean;
}

const Model = ({ isHovered }: ModelProps) => {
  const { scene } = useGLTF(MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Auto-rotate, faster on hover
      const rotationSpeed = isHovered ? 3 : 0.5;
      modelRef.current.rotation.y += delta * rotationSpeed;

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
useGLTF.preload(MODEL_URL);

const Logo3D = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <Suspense fallback={null}>
          <Model isHovered={isHovered} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo3D;
