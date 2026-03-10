/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
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
                dpr={[1, isMobile ? 1.5 : 2]}
                gl={{ alpha: transparent }}
                onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
            >
                <ambientLight intensity={Math.PI} />
                <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                    <Band isMobile={isMobile} />
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

function useCustomCardTexture() {
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        const buildTexture = (img) => {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 3072;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Card center X — shifted left for GLB UV mapping
            const cx = canvas.width * 0.27;
            const contentW = canvas.width * 0.48;
            const leftEdge = cx - contentW / 2;
            const rightEdge = cx + contentW / 2;

            // ── Background gradient ──
            const bgGr = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGr.addColorStop(0, '#05070d');
            bgGr.addColorStop(0.2, '#080c1e');
            bgGr.addColorStop(0.5, '#0b0f28');
            bgGr.addColorStop(0.8, '#080b1a');
            bgGr.addColorStop(1, '#040610');
            ctx.fillStyle = bgGr;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle grid
            ctx.strokeStyle = 'rgba(59, 109, 224, 0.02)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 80) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 80) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // ── Top accent bar ──
            const accentGr = ctx.createLinearGradient(0, 0, canvas.width * 0.55, 0);
            accentGr.addColorStop(0, '#1E4BBD');
            accentGr.addColorStop(0.5, '#2563EB');
            accentGr.addColorStop(1, '#60A5FA');
            ctx.fillStyle = accentGr;
            ctx.fillRect(0, 0, canvas.width, 24);

            // ── 1. CIRCLE PHOTO (top center) ──
            const photoY = 500;
            const photoR = 220;

            // Glow behind photo
            const glow = ctx.createRadialGradient(cx, photoY, photoR * 0.3, cx, photoY, photoR * 2.2);
            glow.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
            glow.addColorStop(0.5, 'rgba(30, 75, 189, 0.12)');
            glow.addColorStop(1, 'rgba(30, 75, 189, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, photoY - photoR * 3, canvas.width, photoR * 6);

            if (img) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, photoY, photoR, 0, Math.PI * 2);
                ctx.clip();
                const imgAspect = img.width / img.height;
                const circleSize = photoR * 2;
                let dw, dh, dx, dy;
                if (imgAspect > 1) {
                    dh = circleSize; dw = circleSize * imgAspect;
                    dx = cx - dw / 2; dy = photoY - photoR;
                } else {
                    dw = circleSize; dh = circleSize / imgAspect;
                    dx = cx - photoR; dy = photoY - dh / 2;
                }
                ctx.drawImage(img, dx, dy, dw, dh);
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(cx, photoY, photoR, 0, Math.PI * 2);
                ctx.fillStyle = '#161a35';
                ctx.fill();
                ctx.fillStyle = '#3B6DE0';
                ctx.font = `bold 120px "Segoe UI", system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('VS', cx, photoY);
            }

            // Photo ring — outer
            ctx.beginPath();
            ctx.arc(cx, photoY, photoR + 14, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(59, 109, 224, 0.12)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Photo ring — main
            ctx.beginPath();
            ctx.arc(cx, photoY, photoR + 6, 0, Math.PI * 2);
            const ringGr = ctx.createLinearGradient(cx - photoR, photoY - photoR, cx + photoR, photoY + photoR);
            ringGr.addColorStop(0, '#2563EB');
            ringGr.addColorStop(0.5, '#3B82F6');
            ringGr.addColorStop(1, '#1D4ED8');
            ctx.strokeStyle = ringGr;
            ctx.lineWidth = 7;
            ctx.stroke();

            // ── 2. NAME ──
            let curY = 900;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold 110px "Segoe UI", system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.shadowColor = 'rgba(37, 99, 235, 0.35)';
            ctx.shadowBlur = 24;
            ctx.fillText('VARUN SEHGAL', cx, curY);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // ── 3. TITLES ──
            curY += 100;
            ctx.fillStyle = '#94a3b8';
            ctx.font = `600 54px "Segoe UI", system-ui, sans-serif`;
            ctx.fillText('UI/UX Designer', cx, curY);

            curY += 75;
            ctx.fillText('Graphic Designer', cx, curY);

            curY += 75;
            ctx.fillStyle = '#7c8db5';
            ctx.font = `500 48px "Segoe UI", system-ui, sans-serif`;
            ctx.fillText('Motion Graphics Artist', cx, curY);

            // ── Divider 1 ──
            curY += 70;
            const divGr = ctx.createLinearGradient(leftEdge, 0, rightEdge, 0);
            divGr.addColorStop(0, 'rgba(59, 109, 224, 0)');
            divGr.addColorStop(0.15, 'rgba(59, 109, 224, 0.5)');
            divGr.addColorStop(0.85, 'rgba(59, 109, 224, 0.5)');
            divGr.addColorStop(1, 'rgba(59, 109, 224, 0)');
            ctx.strokeStyle = divGr;
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(leftEdge + 10, curY); ctx.lineTo(rightEdge - 10, curY); ctx.stroke();

            // ── 4. STATS ROW ──
            curY += 60;
            const stats = [
                { value: '2+', label: 'YEARS' },
                { value: '12+', label: 'PROJECTS' },
                { value: '95%', label: 'RATING' },
            ];
            const statSpacing = contentW / (stats.length + 1);
            stats.forEach((stat, i) => {
                const sx = leftEdge + statSpacing * (i + 1);
                ctx.fillStyle = '#3B8CF0';
                ctx.font = `bold 96px "Segoe UI", system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(59, 140, 240, 0.25)';
                ctx.shadowBlur = 12;
                ctx.fillText(stat.value, sx, curY + 70);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#64748b';
                ctx.font = `600 36px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(stat.label, sx, curY + 120);
            });

            // ── Divider 2 ──
            curY += 190;
            ctx.strokeStyle = divGr;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(leftEdge + 30, curY); ctx.lineTo(rightEdge - 30, curY); ctx.stroke();

            // ── 5. EMAIL ──
            curY += 80;
            ctx.fillStyle = '#e2e8f0';
            ctx.font = `600 56px "Segoe UI", system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('varun.sehgal02@gmail.com', cx, curY);

            // ── 6. LOCATION ──
            curY += 65;
            ctx.fillStyle = '#64748b';
            ctx.font = `500 46px "Segoe UI", system-ui, sans-serif`;
            ctx.fillText('📍 Gwalior, MP, India', cx, curY);

            // ── Divider 3 ──
            curY += 60;
            ctx.strokeStyle = divGr;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(leftEdge + 50, curY); ctx.lineTo(rightEdge - 50, curY); ctx.stroke();

            // ── 7. TOOL BADGES ──
            curY += 55;
            const badges = ['Figma', 'Ps', 'AE', 'Ai'];
            const badgeW = 160;
            const badgeH = 64;
            const badgeGap = 18;
            const totalBW = badges.length * badgeW + (badges.length - 1) * badgeGap;
            let bx = cx - totalBW / 2;
            const badgeY = curY;
            badges.forEach((badge) => {
                ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
                const r = 14;
                ctx.beginPath();
                ctx.moveTo(bx + r, badgeY);
                ctx.lineTo(bx + badgeW - r, badgeY);
                ctx.quadraticCurveTo(bx + badgeW, badgeY, bx + badgeW, badgeY + r);
                ctx.lineTo(bx + badgeW, badgeY + badgeH - r);
                ctx.quadraticCurveTo(bx + badgeW, badgeY + badgeH, bx + badgeW - r, badgeY + badgeH);
                ctx.lineTo(bx + r, badgeY + badgeH);
                ctx.quadraticCurveTo(bx, badgeY + badgeH, bx, badgeY + badgeH - r);
                ctx.lineTo(bx, badgeY + r);
                ctx.quadraticCurveTo(bx, badgeY, bx + r, badgeY);
                ctx.fill();

                ctx.strokeStyle = 'rgba(59, 109, 224, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = '#60A5FA';
                ctx.font = `bold 34px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(badge, bx + badgeW / 2, badgeY + badgeH / 2 + 11);
                bx += badgeW + badgeGap;
            });

            // ── Bottom accent bar ──
            ctx.fillStyle = accentGr;
            ctx.fillRect(0, canvas.height - 18, canvas.width, 18);

            // ── Corner decorations ──
            ctx.strokeStyle = 'rgba(59, 109, 224, 0.12)';
            ctx.lineWidth = 3;
            const cs = 44; const cm = 50;
            ctx.beginPath(); ctx.moveTo(cm, cm + cs); ctx.lineTo(cm, cm); ctx.lineTo(cm + cs, cm); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(canvas.width - cm - cs, cm); ctx.lineTo(canvas.width - cm, cm); ctx.lineTo(canvas.width - cm, cm + cs); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cm, canvas.height - cm - cs); ctx.lineTo(cm, canvas.height - cm); ctx.lineTo(cm + cs, canvas.height - cm); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(canvas.width - cm - cs, canvas.height - cm); ctx.lineTo(canvas.width - cm, canvas.height - cm); ctx.lineTo(canvas.width - cm, canvas.height - cm - cs); ctx.stroke();

            const tex = new THREE.CanvasTexture(canvas);
            tex.flipY = false;
            tex.anisotropy = 16;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.needsUpdate = true;
            setTexture(tex);
        };

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => buildTexture(img);
        img.onerror = () => buildTexture(null);
        img.src = '/varun.jpg';
    }, []);

    return texture;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
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
    const customCardTexture = useCustomCardTexture();

    const [curve] = useState(
        () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 1.5, 0],
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => void (document.body.style.cursor = 'auto');
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
            card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
        }
        if (fixed.current) {
            [j1, j2].forEach((ref) => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
                ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
        }
    });

    curve.curveType = 'chordal';
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
                        onPointerDown={(e) => (
                            e.target.setPointerCapture(e.pointerId),
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
                        )}
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
                    depthTest={false}
                    resolution={isMobile ? [1000, 2000] : [1000, 1000]}
                    useMap
                    map={texture}
                    repeat={[-4, 1]}
                    lineWidth={1}
                />
            </mesh>
        </>
    );
}
