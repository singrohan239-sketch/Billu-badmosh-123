import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { CatModel } from './CatModel';
import { Platform } from './Platform';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function HologramParticles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4; // x
      pos[i * 3 + 1] = Math.random() * 5;     // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4; // z
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for(let i=0; i<count; i++) {
        positionsArray[i*3+1] += delta * 0.5;
        if(positionsArray[i*3+1] > 5) {
          positionsArray[i*3+1] = 0;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#7FFFFF" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export function HologramScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <color attach="background" args={['#03070D']} />
        <fog attach="fog" args={['#03070D', 5, 20]} />
        
        <PerspectiveCamera makeDefault position={[0, 2.5, 9]} fov={45} />
        <OrbitControls 
          enablePan={false}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 + 0.1}
          autoRotate
          autoRotateSpeed={1.5}
        />
        
        <ambientLight intensity={0.2} color="#00D9FF" />
        <pointLight position={[0, 5, 0]} intensity={2} color="#00D9FF" />

        <CatModel />
        <Platform />
        <HologramParticles />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
