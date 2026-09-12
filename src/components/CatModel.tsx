import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CatModel() {
  // ============================================================================
  // SKELETAL REFERENCES (THE CAT'S BONES)
  // Here we set up the 'bones' of our cat so we can move them around frame-by-frame.
  // Every ref points to a specific group of meshes in the 3D scene.
  // ============================================================================
  
  const mainGroupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  
  // Refs for the new ear twitching movements!
  const earLRef = useRef<THREE.Group>(null);
  const earRRef = useRef<THREE.Group>(null);

  const shoulderLRef = useRef<THREE.Group>(null);
  const shoulderRRef = useRef<THREE.Group>(null);
  
  // Tail is split into 3 segments for realistic bending
  const tail1Ref = useRef<THREE.Group>(null);
  const tail2Ref = useRef<THREE.Group>(null);
  const tail3Ref = useRef<THREE.Group>(null);


  // ============================================================================
  // HOLOGRAPHIC MATERIALS
  // Creating the neon cyan glowing wireframe and solid inner core for that JARVIS vibe.
  // Using useMemo so we don't recreate these materials every single frame (saves memory!).
  // ============================================================================
  
  const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00D9FF',
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  }), []);

  const solidMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#001122',
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#FFFFFF', // Bright white for the glowing eyes
  }), []);


  // ============================================================================
  // THE ANIMATION LOOP (THE CAT'S BRAIN & MUSCLES)
  // This useFrame hook runs 60 times a second. We calculate math here to make the cat alive!
  // ============================================================================
  
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    
    // Calculate 28-second cycle for State Machine
    const cycle = t % 28;
    const isResting = cycle > 18; // Last 10 seconds of loop is resting
    
    let restFactor = 0;
    if (isResting) {
        const restTime = cycle - 18; // 0 to 10
        if (restTime < 2) restFactor = Math.sin((restTime / 2) * (Math.PI / 2)); 
        else if (restTime > 8) restFactor = Math.cos(((restTime - 8) / 2) * (Math.PI / 2));
        else restFactor = 1;
    }

    // 1. Hovering & Breathing 
    // Makes the entire hologram gently float up and down. Floats lower when resting.
    if (mainGroupRef.current) {
      const hoverAmp = THREE.MathUtils.lerp(0.05, 0.02, restFactor);
      const hoverOffset = THREE.MathUtils.lerp(-0.2, -0.4, restFactor);
      mainGroupRef.current.position.y = Math.sin(t * 2) * hoverAmp + hoverOffset;
    }
    
    // 2. Fluid Tail Mechanics
    // Normal: natural whip motion. Resting: curls around the body.
    if (tail1Ref.current && tail2Ref.current && tail3Ref.current) {
      const wag1 = Math.sin(t * 1.5) * 0.25;
      const wag2 = Math.sin(t * 1.5 - 0.5) * 0.35;
      const wag3 = Math.sin(t * 1.5 - 1.0) * 0.45;
      
      tail1Ref.current.rotation.y = THREE.MathUtils.lerp(wag1, 0.8, restFactor);
      tail2Ref.current.rotation.y = THREE.MathUtils.lerp(wag2, 0.8, restFactor);
      tail3Ref.current.rotation.y = THREE.MathUtils.lerp(wag3, 0.8, restFactor);
      
      // Slight curl upwards when resting
      tail1Ref.current.rotation.x = THREE.MathUtils.lerp(0, -0.2, restFactor);
    }


    // 3. Ear Twitches (New Movement!)
    // Randomly twitches the ears to simulate hearing digital noises
    if (earLRef.current && earRRef.current) {
      const twitch = Math.random() > 0.98 ? 0.2 : 0;
      // Smoothly return to normal or snap to twitch using Lerp
      earLRef.current.rotation.z = THREE.MathUtils.lerp(earLRef.current.rotation.z, 0.2 + twitch, 0.2);
      earRRef.current.rotation.z = THREE.MathUtils.lerp(earRRef.current.rotation.z, -0.2 - twitch, 0.2);
    }


    // 4. State Machine: Grooming vs Idle vs Resting
    const isLookingAround = cycle > 3 && cycle <= 7; // 4 seconds looking around
    const isGrooming = cycle > 10 && cycle <= 15; // 5 seconds grooming

    // Smooth transition factors for grooming (0 to 1 and back to 0)
    let groomFactor = 0;
    if (isGrooming) {
        const groomTime = cycle - 10;
        groomFactor = Math.sin((groomTime / 5) * Math.PI); 
    }

    if (shoulderLRef.current && shoulderRRef.current && neckRef.current && headRef.current && torsoRef.current) {
      
      // --- DEFAULT IDLE & LOOKING AROUND BEHAVIOR ---
      let targetHeadX = Math.sin(t * 1.2) * 0.05;
      let targetHeadY = Math.sin(t * 0.8) * 0.1;
      let targetHeadZ = 0;
      
      let targetNeckX = 0.3;
      let targetShoulderRX = 0;
      let targetShoulderRZ = 0;
      let targetShoulderLX = 0;
      let targetTorsoY = 1.3;
      let targetTorsoRotX = 0;

      if (isLookingAround && !isResting) {
        // Cat turns its head to investigate something in the room
        targetHeadY = Math.sin(t * 2) * 0.6;
        targetHeadX = -0.15; // Look slightly up
      }
      
      // --- GROOMING BEHAVIOR (Licking paw) ---
      if (groomFactor > 0) {
        // Right paw raises to mouth
        targetShoulderRX = THREE.MathUtils.lerp(targetShoulderRX, -1.6, groomFactor);
        targetShoulderRZ = THREE.MathUtils.lerp(targetShoulderRZ, 0.4, groomFactor);
        
        // Neck bends heavily downwards
        targetNeckX = THREE.MathUtils.lerp(targetNeckX, 0.9, groomFactor);
        
        // Head turns sharply to meet the paw
        targetHeadY = THREE.MathUtils.lerp(targetHeadY, -0.7, groomFactor);
        targetHeadZ = THREE.MathUtils.lerp(targetHeadZ, -0.3, groomFactor);
        
        // The rapid licking bobbing motion
        const lickBob = Math.sin(t * 25) * 0.1 * groomFactor;
        targetHeadX = THREE.MathUtils.lerp(targetHeadX, lickBob, groomFactor);
      }

      // --- RESTING / SITTING BEHAVIOR (Loaf Position) ---
      if (restFactor > 0) {
        // Lower the entire torso
        targetTorsoY = THREE.MathUtils.lerp(targetTorsoY, 0.85, restFactor);
        targetTorsoRotX = THREE.MathUtils.lerp(targetTorsoRotX, 0.15, restFactor);
        
        // Fold both front legs under the body
        targetShoulderLX = THREE.MathUtils.lerp(targetShoulderLX, -1.3, restFactor);
        targetShoulderRX = THREE.MathUtils.lerp(targetShoulderRX, -1.3, restFactor);
        
        // Lower neck and rest head
        targetNeckX = THREE.MathUtils.lerp(targetNeckX, 0.7, restFactor);
        
        // Slow down breathing head bob when resting
        const restingHeadBob = Math.sin(t * 1.5) * 0.02;
        targetHeadX = THREE.MathUtils.lerp(targetHeadX, restingHeadBob, restFactor);
        
        // Keep head centered and relaxed
        targetHeadY = THREE.MathUtils.lerp(targetHeadY, 0, restFactor);
        targetHeadZ = THREE.MathUtils.lerp(targetHeadZ, 0, restFactor);
      }

      // --- APPLYING THE TARGETS TO THE MESHES ---
      // Torso
      torsoRef.current.position.y = targetTorsoY;
      torsoRef.current.rotation.x = targetTorsoRotX;
      
      // Shoulders
      shoulderLRef.current.rotation.x = targetShoulderLX;
      shoulderRRef.current.rotation.x = targetShoulderRX;
      shoulderRRef.current.rotation.z = targetShoulderRZ;
      
      // Neck
      neckRef.current.rotation.x = targetNeckX;
      
      // Head
      headRef.current.rotation.y = targetHeadY;
      headRef.current.rotation.z = targetHeadZ;
      headRef.current.rotation.x = targetHeadX;
    }
  });


  // ============================================================================
  // BONE COMPONENT (HELPER)
  // A reusable function to render a solid shape + a wireframe on top of it.
  // This saves us from writing <mesh> twice for every single body part!
  // ============================================================================
  
  const Bone = ({ geometry, meshPos, meshRot, material, scale }: any) => (
    <group position={meshPos} rotation={meshRot} scale={scale}>
      <mesh geometry={geometry} material={material || solidMaterial} />
      {!material && <mesh geometry={geometry} material={wireframeMaterial} scale={1.02} />}
    </group>
  );


  // ============================================================================
  // 3D MODEL HIERARCHY
  // Here we assemble the cat piece by piece. Notice how groups are nested inside
  // each other (e.g., ears inside head, head inside neck). This is how skeletons work!
  //
  // P.S. Increased the scale and radius sizes to make the cat look muscular 
  // and well-fed, as requested. (No more skinny cat!)
  // ============================================================================
  
  return (
    // Overall Scale multiplier to make the cat significantly bigger in the scene
    <group ref={mainGroupRef} position={[0, 0, 0]} scale={[1.35, 1.35, 1.35]}>
      
      {/* --- MAIN TORSO (Thicker, longer and stronger) --- */}
      <group ref={torsoRef} position={[0, 1.3, 0]}>
        
        <Bone 
          geometry={new THREE.CapsuleGeometry(0.45, 1.0, 12, 16)} 
          meshRot={[Math.PI / 2, 0, 0]} 
        />
        
        
        {/* --- NECK & HEAD SYSTEM --- */}
        <group ref={neckRef} position={[0, 0.3, 0.6]} rotation={[0.3, 0, 0]}>
          
          {/* Thick Neck */}
          <Bone 
            geometry={new THREE.CapsuleGeometry(0.25, 0.4, 8, 16)} 
            meshPos={[0, 0.2, 0]} 
          />
          
          {/* THE HEAD */}
          <group ref={headRef} position={[0, 0.6, 0]}>
            
            {/* Skull - Made wider and rounder */}
            <Bone geometry={new THREE.SphereGeometry(0.35, 16, 16)} />
            
            {/* Snout / Muzzle */}
            <Bone 
              geometry={new THREE.SphereGeometry(0.18, 16, 16)} 
              meshPos={[0, -0.05, 0.3]} 
            />
            
            {/* Glowing Eyes */}
            <Bone 
              geometry={new THREE.SphereGeometry(0.05, 8, 8)} 
              meshPos={[-0.15, 0.1, 0.3]} 
              material={eyeMaterial}
            />
            <Bone 
              geometry={new THREE.SphereGeometry(0.05, 8, 8)} 
              meshPos={[0.15, 0.1, 0.3]} 
              material={eyeMaterial}
            />
            
            {/* Ears (Now attached to Refs for twitching) */}
            <group ref={earLRef} position={[-0.18, 0.3, 0]} rotation={[0.2, 0, 0.2]}>
              <Bone geometry={new THREE.ConeGeometry(0.12, 0.3, 8)} meshPos={[0, 0.15, 0]} />
            </group>

            <group ref={earRRef} position={[0.18, 0.3, 0]} rotation={[0.2, 0, -0.2]}>
              <Bone geometry={new THREE.ConeGeometry(0.12, 0.3, 8)} meshPos={[0, 0.15, 0]} />
            </group>

            {/* Whiskers (Thin cylinders) */}
            <Bone geometry={new THREE.CylinderGeometry(0.006, 0.006, 0.7, 4)} meshPos={[-0.25, -0.05, 0.35]} meshRot={[0, 0, Math.PI/2 - 0.2]} />
            <Bone geometry={new THREE.CylinderGeometry(0.006, 0.006, 0.7, 4)} meshPos={[-0.25, -0.1, 0.35]} meshRot={[0, 0, Math.PI/2]} />
            <Bone geometry={new THREE.CylinderGeometry(0.006, 0.006, 0.7, 4)} meshPos={[0.25, -0.05, 0.35]} meshRot={[0, 0, -(Math.PI/2 - 0.2)]} />
            <Bone geometry={new THREE.CylinderGeometry(0.006, 0.006, 0.7, 4)} meshPos={[0.25, -0.1, 0.35]} meshRot={[0, 0, -Math.PI/2]} />
          
          </group>
        </group>


        {/* --- FRONT LEGS (Thicker Shoulders & Paws) --- */}
        <group ref={shoulderLRef} position={[-0.25, -0.1, 0.45]}>
          <Bone geometry={new THREE.CylinderGeometry(0.12, 0.08, 1.0, 8)} meshPos={[0, -0.4, 0]} />
          <Bone geometry={new THREE.SphereGeometry(0.12, 8, 8)} meshPos={[0, -0.9, 0.05]} />
        </group>

        <group ref={shoulderRRef} position={[0.25, -0.1, 0.45]}>
          <Bone geometry={new THREE.CylinderGeometry(0.12, 0.08, 1.0, 8)} meshPos={[0, -0.4, 0]} />
          <Bone geometry={new THREE.SphereGeometry(0.12, 8, 8)} meshPos={[0, -0.9, 0.05]} />
        </group>


        {/* --- HIND LEGS (Muscular thighs, seated posture) --- */}
        <group position={[-0.3, -0.1, -0.4]}>
          <Bone geometry={new THREE.CapsuleGeometry(0.2, 0.55, 8, 8)} meshPos={[0, -0.2, 0.15]} meshRot={[0.5, 0, 0]} />
          <Bone geometry={new THREE.CylinderGeometry(0.1, 0.08, 0.6, 8)} meshPos={[0, -0.6, -0.1]} meshRot={[-0.2, 0, 0]} />
          <Bone geometry={new THREE.SphereGeometry(0.12, 8, 8)} meshPos={[0, -0.9, 0.05]} />
        </group>

        <group position={[0.3, -0.1, -0.4]}>
          <Bone geometry={new THREE.CapsuleGeometry(0.2, 0.55, 8, 8)} meshPos={[0, -0.2, 0.15]} meshRot={[0.5, 0, 0]} />
          <Bone geometry={new THREE.CylinderGeometry(0.1, 0.08, 0.6, 8)} meshPos={[0, -0.6, -0.1]} meshRot={[-0.2, 0, 0]} />
          <Bone geometry={new THREE.SphereGeometry(0.12, 8, 8)} meshPos={[0, -0.9, 0.05]} />
        </group>


        {/* --- TAIL (Fully jointed and thicker at the base) --- */}
        <group ref={tail1Ref} position={[0, 0.3, -0.5]}>
          
          <Bone geometry={new THREE.CylinderGeometry(0.08, 0.06, 0.4, 8)} meshPos={[0, 0, -0.2]} meshRot={[Math.PI/2, 0, 0]} />
          
          <group ref={tail2Ref} position={[0, 0, -0.4]}>
            <Bone geometry={new THREE.CylinderGeometry(0.06, 0.04, 0.4, 8)} meshPos={[0, 0, -0.2]} meshRot={[Math.PI/2, 0, 0]} />
            
            <group ref={tail3Ref} position={[0, 0, -0.4]}>
              <Bone geometry={new THREE.CylinderGeometry(0.04, 0.02, 0.4, 8)} meshPos={[0, 0, -0.2]} meshRot={[Math.PI/2, 0, 0]} />
            </group>
          
          </group>
        </group>

      </group>
    </group>
  );
}
