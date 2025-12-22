import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface ModelProps {
  isHovered: boolean;
}

const GLB_URL = 'https://pgppgdlkoblmpqdyfxfc.supabase.co/storage/v1/object/public/logo//untitled1%20(1).glb';

const Model = ({ isHovered }: ModelProps) => {
  const { scene } = useGLTF(GLB_URL);
  const modelRef = useRef<THREE.Group>(null);

  // Center the model geometry on first load
  useEffect(() => {
    if (scene) {
      // Compute the bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      
      // Offset the scene so its center is at the origin
      scene.position.sub(center);
    }
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      // Scale effect on hover
      const targetScale = isHovered ? 1.8 : 1.5;
      modelRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Subtle floating animation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={modelRef}>
      <Center>
        <primitive
          object={scene}
          scale={1.5}
          position={[0, 0, 0]}
        />
      </Center>
    </group>
  );
};

// Preload the model for better performance
useGLTF.preload(GLB_URL);

const Logo3D = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-32 h-32 cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#CCFF00" />
        <Suspense fallback={null}>
          <Model isHovered={isHovered} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default Logo3D;
