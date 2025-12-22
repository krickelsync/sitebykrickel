import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface MeshProps {
  isHovered: boolean;
}

const ProceduralLogo = ({ isHovered }: MeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Auto-rotate
      const rotationSpeed = isHovered ? 0.03 : 0.01;
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.5;

      // Floating animation (up and down)
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;

      // Scale effect on hover
      const targetScale = isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshStandardMaterial
        color="#CCFF00"
        wireframe={true}
        roughness={0.2}
        metalness={1.0}
        emissive="#CCFF00"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

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
        <ProceduralLogo isHovered={isHovered} />
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
