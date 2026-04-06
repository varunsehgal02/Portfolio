/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 14, transparent = true, frontSrc = null, backSrc = null }) {
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="lanyard-wrapper">
            <Canvas
                camera={{ position: position, fov: fov }}
                gl={{ alpha: transparent }}
                onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
            >
                <ambientLight intensity={Math.PI} />
                <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                    <Band isMobile={isMobile} frontSrc={frontSrc} backSrc={backSrc} />
                </Physics>
                <Environment blur={0.75}>
                    <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
                </Environment>
            </Canvas>
        </div>
    );
}

function useCustomCardTexture(frontSrc, backSrc) {
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        if (!frontSrc) return;

        const buildTexture = (imgFront, imgBack) => {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, 2048, 1024);

            // The 3D ID card model has an aspect ratio of roughly 1.1 / 1.52 = 0.723
            const targetRatio = 1.1 / 1.52;
            
            const drawContain = (img, offsetX) => {
                if (!img) return;
                const imgRatio = img.width / img.height;
                let drawW = 1024;
                let drawH = 1024;
                let drawX = offsetX;
                let drawY = 0;

                if (imgRatio > targetRatio) {
                    // Image is wider than target ratio
                    // Fit width, letterbox height
                    drawW = 1024;
                    drawH = 1024 * (targetRatio / imgRatio);
                    drawY = (1024 - drawH) / 2;
                } else {
                    // Image is taller than target ratio
                    // Fit height, pillarbox width
                    drawH = 1024;
                    drawW = 1024 * (imgRatio / targetRatio);
                    drawX = offsetX + (1024 - drawW) / 2;
                }
                
                // User requested to shift all images a little bit UP on the ID card.
                // Subtracting from drawY physically shifts the drawn image closer to the top edge. 
                const shiftUpAmount = 95; 
                drawY -= shiftUpAmount;
                
                ctx.drawImage(img, drawX, drawY, drawW, drawH);
            };

            // Front image on left half
            drawContain(imgFront, 0);
            
            // Back image on right half
            if (imgBack) {
                drawContain(imgBack, 1024);
            } else if (imgFront) {
                drawContain(imgFront, 1024);
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.flipY = false;
            tex.anisotropy = 16;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            
            setTexture((prev) => {
                prev?.dispose?.();
                return tex;
            });
        };

        const loadImages = async () => {
            try {
                const loadImage = (src) => new Promise((resolve) => {
                    if (!src) return resolve(null);
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                    img.src = src;
                });

                const [front, back] = await Promise.all([
                    loadImage(frontSrc),
                    loadImage(backSrc)
                ]);
                
                buildTexture(front, back);
            } catch (e) {
                console.error(e);
            }
        };

        loadImages();

        return () => {
            setTexture((prev) => {
                prev?.dispose?.();
                return null;
            });
        };
    }, [frontSrc, backSrc]);

    return texture;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, frontSrc = null, backSrc = null }) {
    const { size } = useThree();
    const band = useRef();
    const fixed = useRef();
    const j1 = useRef();
    const j2 = useRef();
    const j3 = useRef();
    const card = useRef();
    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

    const { nodes, materials } = useGLTF('/card.glb');
    const texture = useTexture('/lanyard.png');
    const customCardTexture = useCustomCardTexture(frontSrc, backSrc);

    const [curve] = useState(
        () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const safePointsRef = useRef([]);
    const hasSafePointsRef = useRef(false);
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 2.0, 0],
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => void (document.body.style.cursor = 'auto');
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) {
            return;
        }

        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
            
            let targetPos = new THREE.Vector3(vec.x - dragged.x, vec.y - dragged.y, vec.z - dragged.z);
            if (fixed.current) {
                const origin = fixed.current.translation();
                const originVec = new THREE.Vector3(origin.x, origin.y, origin.z);
                const anchorWorld = targetPos.clone().add(new THREE.Vector3(0, 2.0, 0));
                if (anchorWorld.distanceTo(originVec) > 5.0) {
                   anchorWorld.sub(originVec).normalize().multiplyScalar(5.0).add(originVec);
                   targetPos = anchorWorld.sub(new THREE.Vector3(0, 2.0, 0));
                }
            }
            const currentPos = card.current.translation();
            const smoothedPos = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
            smoothedPos.lerp(targetPos, delta * 15); // Smooth drag interpolation
            card.current?.setNextKinematicTranslation({ x: smoothedPos.x, y: smoothedPos.y, z: smoothedPos.z });
        }

        const fixedPos = fixed.current.translation();
        const maxDist = 20.0;
        [j1, j2].forEach((ref) => {
            if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
            const trans = ref.current.translation();
            if (Number.isFinite(trans.x) && Number.isFinite(trans.y) && Number.isFinite(trans.z)) {
                const transVec = new THREE.Vector3(trans.x, trans.y, trans.z);
                if (transVec.distanceTo(fixedPos) < maxDist) {
                    const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(trans)));
                    ref.current.lerped.lerp(trans, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
                }
            }
        });

        const t3 = j3.current.translation();
        if (Number.isFinite(t3.x) && Number.isFinite(t3.y) && Number.isFinite(t3.z)) {
            const t3Vec = new THREE.Vector3(t3.x, t3.y, t3.z);
            if (t3Vec.distanceTo(fixedPos) < maxDist) {
                curve.points[0].copy(t3);
            }
        }
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixedPos);

        const nextPoints = curve.getPoints(isMobile ? 16 : 32);
        const hasInvalidPoint = nextPoints.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z));
        if (hasInvalidPoint) {
            if (j1.current && j2.current && j3.current) {
                j1.current.setTranslation({ x: fixedPos.x, y: fixedPos.y - 1, z: fixedPos.z }, true);
                j2.current.setTranslation({ x: fixedPos.x, y: fixedPos.y - 2, z: fixedPos.z }, true);
                j3.current.setTranslation({ x: fixedPos.x, y: fixedPos.y - 3, z: fixedPos.z }, true);
                j1.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                j2.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                j3.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                if (j1.current.lerped) j1.current.lerped.set(fixedPos.x, fixedPos.y - 1, fixedPos.z);
                if (j2.current.lerped) j2.current.lerped.set(fixedPos.x, fixedPos.y - 2, fixedPos.z);
                curve.points[0].set(fixedPos.x, fixedPos.y - 3, fixedPos.z);
            }
            if (hasSafePointsRef.current && safePointsRef.current.length > 0) {
                band.current.geometry.setPoints(safePointsRef.current);
            }
        } else {
            safePointsRef.current = nextPoints;
            hasSafePointsRef.current = true;
            band.current.geometry.setPoints(nextPoints);
        }

        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        
        let targetRotY = 0;
        if (!dragged) {
            targetRotY = isFlipped ? Math.PI / 2 : 0;
        }
        
        // Use a spring system to rotate the card. Adding damping so it stops perfectly at target
        const diffY = ((targetRotY - rot.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        card.current.setAngvel({ x: ang.x, y: ang.y * 0.8 + diffY * 0.25, z: ang.z });
    });

    curve.curveType = 'centripetal';
    if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}>
                    <BallCollider args={[0.1]} mass={0.1} sensor />
                </RigidBody>
                <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}>
                    <BallCollider args={[0.1]} mass={0.1} sensor />
                </RigidBody>
                <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}>
                    <BallCollider args={[0.1]} mass={0.1} sensor />
                </RigidBody>
                <RigidBody position={[0, -5.0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[1.1, 1.52, 0.01]} />
                    <group
                        scale={2.9}
                        position={[0, -1.46, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped((f) => !f);
                        }}
                        onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
                        onPointerDown={(e) => (
                            e.target.setPointerCapture(e.pointerId),
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
                        )}
                        // Add card cut effect class for CSS
                        className="lanyard-card-cut"
                    >
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial
                                map={customCardTexture || materials.base.map}
                                map-anisotropy={16}
                                clearcoat={isMobile ? 0 : 1}
                                clearcoatRoughness={0.15}
                                roughness={0.9}
                                metalness={0.8}
                            />
                        </mesh>
                        <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest
                    depthWrite={false}
                    transparent
                    opacity={0.9}
                    alphaTest={0.25}
                    resolution={[Math.max(1, size.width), Math.max(1, size.height)]}
                    useMap={Boolean(texture?.image)}
                    map={texture?.image ? texture : null}
                    repeat={[-4, 1]}
                    lineWidth={isMobile ? 1.6 : 1.2}
                />
            </mesh>
        </>
    );
}
