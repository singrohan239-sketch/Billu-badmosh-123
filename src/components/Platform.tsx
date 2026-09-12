import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Platform() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* Base Cylinder */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[3, 3.2, 0.4, 32]} />
        <meshBasicMaterial color="#010308" />
      </mesh>
      
      {/* Edge Glow */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[3.25, 3.25, 0.45, 32]} />
        <meshBasicMaterial color="#00D9FF" transparent opacity={0.2} wireframe />
      </mesh>

      {/* Rotating Inner Rings */}
      <group ref={ringsRef}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 2.5, 32, 4]} />
          <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.6, 2.8, 64]} />
          <meshBasicMaterial color="#00D9FF" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Center Core */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#0066FF" transparent opacity={0.2} />
      </mesh>

      {/* Vertical Light Beams */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 5, 32, 1, true]} />
        <meshBasicMaterial 
          color="#00D9FF" 
          transparent 
          opacity={0.03} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
