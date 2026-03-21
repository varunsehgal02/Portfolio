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
            if (!ctx) return;
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
            ctx.strokeStyle = 'rgba(230, 255, 0, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 80) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 80) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // ── Top accent bar ──
            const accentGr = ctx.createLinearGradient(0, 0, canvas.width * 0.55, 0);
            accentGr.addColorStop(0, '#C4DB00');
            accentGr.addColorStop(0.5, '#E6FF00');
            accentGr.addColorStop(1, '#F2FF73');
            ctx.fillStyle = accentGr;
            ctx.fillRect(0, 0, canvas.width, 24);

            // Increase size inside of ID card and shift left
            ctx.save();
            const shiftLeftAmount = 30; // Shift all things inside the ID card left
            const globalScale = 1.1; // Increase everything by 10%
            const centerY = 1050; // Approximate vertical center of content block
            
            ctx.translate(cx - shiftLeftAmount, centerY);
            // Sqish X by 0.8 for UV mapping, but apply globalScale to both X and Y
            ctx.scale(0.8 * globalScale, globalScale);
            ctx.translate(-cx, -centerY);

            // ── 1. CIRCLE PHOTO (top center) ──
            const photoY = 500;
            const photoR = 220;
            const photoRadiusX = photoR;
            const photoRadiusY = photoR;

            // Glow behind photo
            const glow = ctx.createRadialGradient(cx, photoY, photoR * 0.3, cx, photoY, photoR * 2.2);
            glow.addColorStop(0, 'rgba(230, 255, 0, 0.28)');
            glow.addColorStop(0.5, 'rgba(196, 219, 0, 0.12)');
            glow.addColorStop(1, 'rgba(196, 219, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, photoY - photoR * 3, canvas.width, photoR * 6);

            if (img) {
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(cx, photoY, photoRadiusX, photoRadiusY, 0, 0, Math.PI * 2);
                ctx.clip();
                const imgAspect = img.width / img.height;
                const frameWidth = photoRadiusX * 2;
                const frameHeight = photoRadiusY * 2;
                const zoomScale = 1.15; // "zoom my img litt bit"
                let dw, dh, dx, dy;
                
                if (imgAspect > 1) {
                    dh = frameHeight * zoomScale;
                    dw = frameHeight * imgAspect * zoomScale;
                } else {
                    dw = frameWidth * zoomScale;
                    dh = (frameWidth / imgAspect) * zoomScale;
                }
                
                // Center the zoomed image
                dx = cx - dw / 2;
                dy = photoY - dh / 2;
                
                ctx.drawImage(img, dx, dy, dw, dh);
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.ellipse(cx, photoY, photoRadiusX, photoRadiusY, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#151515';
                ctx.fill();
                ctx.fillStyle = '#E6FF00';
                ctx.font = `bold 120px "Satoshi", "Inter", system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('VS', cx, photoY);
            }

            // Photo ring — outer
            ctx.beginPath();
            ctx.ellipse(cx, photoY, photoRadiusX + 14, photoRadiusY + 14, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(230, 255, 0, 0.12)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Photo ring — main
            ctx.beginPath();
            ctx.ellipse(cx, photoY, photoRadiusX + 6, photoRadiusY + 6, 0, 0, Math.PI * 2);
            const ringGr = ctx.createLinearGradient(cx - photoRadiusY, photoY - photoRadiusY, cx + photoRadiusY, photoY + photoRadiusY);
            ringGr.addColorStop(0, '#C4DB00');
            ringGr.addColorStop(0.5, '#E6FF00');
            ringGr.addColorStop(1, '#F2FF73');
            ctx.strokeStyle = ringGr;
            ctx.lineWidth = 7;
            ctx.stroke();

            // ── 2. NAME ──
            let curY = 900;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold 110px "Satoshi", "Inter", system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.shadowColor = 'rgba(230, 255, 0, 0.25)';
            ctx.shadowBlur = 24;
            ctx.fillText('VARUN SEHGAL', cx, curY);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // ── 3. TITLES ──
            curY += 100;
            ctx.fillStyle = '#a1a1aa';
            ctx.font = `600 54px "Inter", system-ui, sans-serif`;
            ctx.fillText('UI/UX Designer', cx, curY);

            curY += 75;
            ctx.fillText('Graphic Designer', cx, curY);

            curY += 75;
            ctx.fillStyle = '#71717a';
            ctx.font = `500 48px "Inter", system-ui, sans-serif`;
            ctx.fillText('Motion Graphics Artist', cx, curY);

            // ── Divider 1 ──
            curY += 70;
            const divGr = ctx.createLinearGradient(leftEdge, 0, rightEdge, 0);
            divGr.addColorStop(0, 'rgba(230, 255, 0, 0)');
            divGr.addColorStop(0.15, 'rgba(230, 255, 0, 0.45)');
            divGr.addColorStop(0.85, 'rgba(230, 255, 0, 0.45)');
            divGr.addColorStop(1, 'rgba(230, 255, 0, 0)');
            ctx.strokeStyle = divGr;
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(leftEdge + 10, curY); ctx.lineTo(rightEdge - 10, curY); ctx.stroke();

            // ── 4. STATS ROW ──
            curY += 60;
            const stats = [
                { value: '2+', label: 'YEARS' },
                { value: '5+', label: 'PROJECTS' },
                { value: '95%', label: 'RATING' },
            ];
            const statSpacing = contentW / (stats.length + 1);
            stats.forEach((stat, i) => {
                const sx = leftEdge + statSpacing * (i + 1);
                ctx.fillStyle = '#E6FF00';
                ctx.font = `bold 96px "Satoshi", "Inter", system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(230, 255, 0, 0.22)';
                ctx.shadowBlur = 12;
                ctx.fillText(stat.value, sx, curY + 70);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#71717a';
                ctx.font = `600 36px "Inter", system-ui, sans-serif`;
                ctx.fillText(stat.label, sx, curY + 120);
            });

            // ── Divider 2 ──
            curY += 190;
            ctx.strokeStyle = divGr;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(leftEdge + 30, curY); ctx.lineTo(rightEdge - 30, curY); ctx.stroke();

            // ── 5. EMAIL ──
            curY += 80;
            ctx.fillStyle = '#ffffff';
            ctx.font = `600 56px "Inter", system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('varun.sehgal02@gmail.com', cx, curY);

            // ── 6. LOCATION ──
            curY += 65;
            ctx.fillStyle = '#a1a1aa';
            ctx.font = `500 46px "Inter", system-ui, sans-serif`;
            ctx.fillText('📍 Gwalior, MP, India', cx, curY);

            // ── Divider 3 ──
            curY += 60;
            ctx.strokeStyle = divGr;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(leftEdge + 50, curY); ctx.lineTo(rightEdge - 50, curY); ctx.stroke();

            // ── 7. TOOL BADGES ──
            curY += 55;
            const badges = ['Figma', 'Ps', 'AE', 'Ai'];
            const badgeW = 190;
            const badgeH = 82;
            const badgeGap = 16;
            const totalBW = badges.length * badgeW + (badges.length - 1) * badgeGap;
            let bx = cx - totalBW / 2;
            const badgeY = curY;
            badges.forEach((badge) => {
                ctx.fillStyle = 'rgba(230, 255, 0, 0.1)';
                const r = 18;
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

                ctx.strokeStyle = 'rgba(230, 255, 0, 0.22)';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = '#E6FF00';
                ctx.font = `bold 42px "Satoshi", "Inter", system-ui, sans-serif`;
                ctx.fillText(badge, bx + badgeW / 2, badgeY + badgeH / 2 + 14);
                bx += badgeW + badgeGap;
            });

            // ── Bottom accent bar ──
            ctx.restore();
            ctx.fillStyle = accentGr;
            ctx.fillRect(0, canvas.height - 18, canvas.width, 18);

            // ── Corner decorations ──
            ctx.strokeStyle = 'rgba(230, 255, 0, 0.12)';
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
            setTexture((prev) => {
                prev?.dispose?.();
                return tex;
            });
        };

        // Draw instantly with the "VS" fallback so text is visible immediately.
        buildTexture(null);

        // Then load the real photo and redraw.
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => buildTexture(img);
        img.onerror = () => { /* fallback already set */ };
        img.src = '/varun.jpg';

        return () => {
            setTexture((prev) => {
                prev?.dispose?.();
                return null;
            });
        };
    }, []);

    return texture;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
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
    const customCardTexture = useCustomCardTexture();

    const [curve] = useState(
        () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const safePointsRef = useRef([]);
    const hasSafePointsRef = useRef(false);
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);

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
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
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
