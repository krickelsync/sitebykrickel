import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, memo } from 'react';
import * as THREE from 'three';

const GLB_URL = '/models/logo.glb';

const Model = memo(() => {
  const { scene } = useGLTF(GLB_URL);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (scene && groupRef.current) {
      // Clone the scene to avoid mutation issues
      const clonedScene = scene.clone();
      
      // Compute bounding box to center the model
      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Move the model so its center is at the origin
      clonedScene.position.x = -center.x;
      clonedScene.position.y = -center.y;
      clonedScene.position.z = -center.z;
      
      // Clear previous children and add the centered clone
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clonedScene);
      
      // Adjust camera to fit the model
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5; // Add some padding
      camera.position.set(0, 0, cameraZ);
      camera.lookAt(0, 0, 0);
    }
  }, [scene, camera]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
    }
  });

  return <group ref={groupRef} />;
});

Model.displayName = 'Model';

// Preload the model for better performance
useGLTF.preload(GLB_URL);

// Static logo fallback for mobile
const StaticLogo = memo(() => (
  <div className="w-10 h-10 flex items-center justify-center">
    <svg viewBox="0 0 32 32" className="w-8 h-8 text-primary">
      <polygon 
        points="16,2 30,28 2,28" 
        fill="currentColor" 
        className="drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
      />
    </svg>
  </div>
));

StaticLogo.displayName = 'StaticLogo';

const Logo3D = memo(() => {
  const [isHovered, setIsHovered] = useState(false);

  // Prevent default drag behavior on touch/pointer events
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-20 h-20 cursor-grab active:cursor-grabbing overflow-visible select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onDragStart={handleDragStart}
      draggable={false}
      style={{ overflow: 'visible', touchAction: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ 
          background: 'transparent',
          overflow: 'visible',
          touchAction: 'none'
        }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]} // Limit DPR for performance
        frameloop="demand" // Only render on demand
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#60A5FA" />
        <Suspense fallback={null}>
          <Model />
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
});

Logo3D.displayName = 'Logo3D';

export default Logo3D;
