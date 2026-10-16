import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { soundFX } from '../../lib/audio';
import { LeaderboardEntry } from '../../types';

interface CarGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamLogoText?: string;
  carColorHex?: string;
  highScore: number;
  onNewScore: (entry: LeaderboardEntry) => void;
}

export const CarGameModal: React.FC<CarGameModalProps> = ({
  isOpen,
  onClose,
  teamLogoText = 'EGYPT · SPHEREx',
  carColorHex = '#06b6d4',
  highScore,
  onNewScore,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [combo, setCombo] = useState(1);
  const [playerNickname, setPlayerNickname] = useState('Captain_Astronaut');
  const [submitted, setSubmitted] = useState(false);

  // References to keep loop state without stale closures
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'paused' | 'gameover',
    playerLane: 0, // -1: Left, 0: Center, 1: Right
    targetLaneX: 0,
    currentSpeed: 100, // km/h
    baseSpeed: 100,
    maxSpeed: 280,
    isBoosting: false,
    score: 0,
    distance: 0,
    combo: 1,
    obstacles: [] as { mesh: THREE.Group; lane: number; speed: number; passed: boolean }[],
  });

  const LANE_WIDTH = 4.2;

  const handleStart = () => {
    stateRef.current.gameState = 'playing';
    stateRef.current.playerLane = 0;
    stateRef.current.targetLaneX = 0;
    stateRef.current.currentSpeed = 120;
    stateRef.current.score = 0;
    stateRef.current.distance = 0;
    stateRef.current.combo = 1;
    stateRef.current.obstacles.forEach((obs) => {
      obs.mesh.position.z = -100 - Math.random() * 200;
    });

    setScore(0);
    setDistance(0);
    setSpeed(120);
    setCombo(1);
    setSubmitted(false);
    setGameState('playing');

    soundFX.startEngine();
  };

  const handlePauseToggle = () => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.gameState = 'paused';
      setGameState('paused');
      soundFX.stopEngine();
    } else if (stateRef.current.gameState === 'paused') {
      stateRef.current.gameState = 'playing';
      setGameState('playing');
      soundFX.startEngine();
    }
  };

  const moveLane = (dir: -1 | 1) => {
    if (stateRef.current.gameState !== 'playing') return;
    const nextLane = Math.max(-1, Math.min(1, stateRef.current.playerLane + dir));
    if (nextLane !== stateRef.current.playerLane) {
      stateRef.current.playerLane = nextLane;
      stateRef.current.targetLaneX = nextLane * LANE_WIDTH;
      soundFX.playClick();
    }
  };

  const triggerBoost = (active: boolean) => {
    if (stateRef.current.gameState !== 'playing') return;
    stateRef.current.isBoosting = active;
    if (active) {
      soundFX.playBoost();
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLane(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveLane(1);
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        triggerBoost(true);
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        handlePauseToggle();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        triggerBoost(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isOpen]);

  // THREE.JS 3D SCENE & GAME ENGINE
  useEffect(() => {
    if (!isOpen) return;
    const container = mountRef.current;
    if (!container) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a18, 0.009);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      600
    );
    camera.position.set(0, 3.8, 8.5);
    camera.lookAt(0, 1.2, -15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // ROAD GEOMETRY & MATERIALS
    const roadWidth = LANE_WIDTH * 3 + 2;
    const roadLength = 350;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 1);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x090e1c,
      roughness: 0.3,
      metalness: 0.6,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = -roadLength / 2 + 10;
    scene.add(road);

    // NEON LANE STRIPES
    const stripeCount = 20;
    const stripesGroup = new THREE.Group();
    const stripeGeo = new THREE.PlaneGeometry(0.2, 5);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });

    const stripes: THREE.Mesh[] = [];
    for (let i = 0; i < stripeCount; i++) {
      // Left lane divider
      const s1 = new THREE.Mesh(stripeGeo, stripeMat);
      s1.rotation.x = -Math.PI / 2;
      s1.position.set(-LANE_WIDTH / 2, 0.02, -i * 18);
      stripesGroup.add(s1);
      stripes.push(s1);

      // Right lane divider
      const s2 = new THREE.Mesh(stripeGeo, stripeMat);
      s2.rotation.x = -Math.PI / 2;
      s2.position.set(LANE_WIDTH / 2, 0.02, -i * 18);
      stripesGroup.add(s2);
      stripes.push(s2);
    }
    scene.add(stripesGroup);

    // GLOWING ROAD EDGES
    const edgeGeo = new THREE.BoxGeometry(0.3, 0.4, roadLength);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const leftEdge = new THREE.Mesh(edgeGeo, edgeMat);
    leftEdge.position.set(-roadWidth / 2, 0.2, -roadLength / 2 + 10);
    scene.add(leftEdge);

    const rightEdge = new THREE.Mesh(edgeGeo, edgeMat);
    rightEdge.position.set(roadWidth / 2, 0.2, -roadLength / 2 + 10);
    scene.add(rightEdge);

    // COSMIC CELESTIAL BACKGROUND & STARS
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 1] = Math.random() * 80 + 10;
      starPos[i * 3 + 2] = -Math.random() * 300;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 1.6, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // DISTANT PLANET X SILHOUETTE IN SKY
    const planetXGeo = new THREE.SphereGeometry(18, 32, 32);
    const planetXMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    const planetX = new THREE.Mesh(planetXGeo, planetXMat);
    planetX.position.set(50, 45, -240);
    scene.add(planetX);

    // -------------------------------------------------------------
    // PROCEDURAL HIGH-TECH PLAYER RACING CAR
    // -------------------------------------------------------------
    const createPlayerCar = () => {
      const car = new THREE.Group();

      // Sleek Cyber Chassis
      const bodyGeo = new THREE.BoxGeometry(2.1, 0.75, 4.4);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(carColorHex),
        roughness: 0.2,
        metalness: 0.85,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.55;
      car.add(body);

      // Cabin / Cockpit Canopy (Dark Glass)
      const cabinGeo = new THREE.BoxGeometry(1.4, 0.55, 2.2);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x050814,
        roughness: 0.1,
        metalness: 0.9,
      });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.1, -0.2);
      car.add(cabin);

      // Aerodynamic Rear Wing / Spoiler
      const wingGeo = new THREE.BoxGeometry(2.3, 0.1, 0.6);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.set(0, 1.25, 1.8);
      car.add(wing);

      // Decal canvas texture on hood
      const decalCanvas = document.createElement('canvas');
      decalCanvas.width = 256;
      decalCanvas.height = 128;
      const dCtx = decalCanvas.getContext('2d')!;
      dCtx.fillStyle = '#111827';
      dCtx.fillRect(0, 0, 256, 128);
      dCtx.fillStyle = '#06b6d4';
      dCtx.font = 'bold 24px sans-serif';
      dCtx.textAlign = 'center';
      dCtx.fillText(teamLogoText, 128, 70);

      const decalTex = new THREE.CanvasTexture(decalCanvas);
      const decalGeo = new THREE.PlaneGeometry(1.6, 0.8);
      const decalMat = new THREE.MeshBasicMaterial({ map: decalTex, transparent: true });
      const decal = new THREE.Mesh(decalGeo, decalMat);
      decal.rotation.x = -Math.PI / 2;
      decal.position.set(0, 0.93, -1.1);
      car.add(decal);

      // Headlights (Twin glowing cyan lights)
      const headLightGeo = new THREE.BoxGeometry(0.35, 0.15, 0.1);
      const headLightMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const leftLight = new THREE.Mesh(headLightGeo, headLightMat);
      leftLight.position.set(-0.7, 0.55, -2.21);
      car.add(leftLight);

      const rightLight = new THREE.Mesh(headLightGeo, headLightMat);
      rightLight.position.set(0.7, 0.55, -2.21);
      car.add(rightLight);

      // Taillights & Nitro Thrusters
      const tailLightGeo = new THREE.BoxGeometry(0.5, 0.15, 0.1);
      const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const leftTail = new THREE.Mesh(tailLightGeo, tailLightMat);
      leftTail.position.set(-0.65, 0.6, 2.21);
      car.add(leftTail);

      const rightTail = new THREE.Mesh(tailLightGeo, tailLightMat);
      rightTail.position.set(0.65, 0.6, 2.21);
      car.add(rightTail);

      // Nitro exhaust glow
      const nitroGeo = new THREE.CylinderGeometry(0.12, 0.22, 0.8, 16);
      const nitroMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0 });
      const nitroL = new THREE.Mesh(nitroGeo, nitroMat);
      nitroL.rotation.x = Math.PI / 2;
      nitroL.position.set(-0.35, 0.45, 2.6);
      car.add(nitroL);

      const nitroR = new THREE.Mesh(nitroGeo, nitroMat);
      nitroR.rotation.x = Math.PI / 2;
      nitroR.position.set(0.35, 0.45, 2.6);
      car.add(nitroR);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.8 });
      const wheelPositions = [
        [-1.05, 0.38, -1.3],
        [1.05, 0.38, -1.3],
        [-1.05, 0.38, 1.3],
        [1.05, 0.38, 1.3],
      ];
      wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, y, z);
        car.add(wheel);
      });

      return { car, nitroMat };
    };

    const { car: playerCar, nitroMat: playerNitroMat } = createPlayerCar();
    playerCar.position.set(0, 0, 0);
    scene.add(playerCar);

    // -------------------------------------------------------------
    // TRAFFIC / OBSTACLE VEHICLES
    // -------------------------------------------------------------
    const createObstacleCar = (colorHex: number) => {
      const group = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(2.0, 0.7, 4.0);
      const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.7 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.55;
      group.add(body);

      const cabinGeo = new THREE.BoxGeometry(1.3, 0.5, 2.0);
      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x050814 });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.05, 0);
      group.add(cabin);

      // Taillights
      const redLightGeo = new THREE.BoxGeometry(0.4, 0.15, 0.1);
      const redLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const tl = new THREE.Mesh(redLightGeo, redLightMat);
      tl.position.set(-0.6, 0.55, 2.01);
      group.add(tl);
      const tr = new THREE.Mesh(redLightGeo, redLightMat);
      tr.position.set(0.6, 0.55, 2.01);
      group.add(tr);

      return group;
    };

    const obstacleColors = [0xef4444, 0x10b981, 0xa855f7, 0xf59e0b];
    const obstacles: { mesh: THREE.Group; lane: number; speed: number; passed: boolean }[] = [];

    for (let i = 0; i < 6; i++) {
      const lane = [-1, 0, 1][Math.floor(Math.random() * 3)];
      const obsMesh = createObstacleCar(obstacleColors[i % obstacleColors.length]);
      obsMesh.position.set(lane * LANE_WIDTH, 0, -50 - i * 45);
      scene.add(obsMesh);
      obstacles.push({
        mesh: obsMesh,
        lane,
        speed: 40 + Math.random() * 30,
        passed: false,
      });
    }
    stateRef.current.obstacles = obstacles;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // ANIMATION & GAME PHYSICS LOOP
    let animId: number;
    let clock = new THREE.Clock();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const delta = Math.min(clock.getDelta(), 0.05);

      if (stateRef.current.gameState === 'playing') {
        const s = stateRef.current;

        // Speed adjustment with boost
        const targetSpeed = s.isBoosting ? s.maxSpeed : s.baseSpeed;
        s.currentSpeed = THREE.MathUtils.lerp(s.currentSpeed, targetSpeed, delta * 3);

        // Update sound engine pitch
        soundFX.updateEnginePitch(s.currentSpeed / s.maxSpeed);

        // Player nitro visual
        playerNitroMat.opacity = s.isBoosting ? 0.9 : 0;

        // Distance & score
        const metersThisFrame = (s.currentSpeed * 1000) / 3600 * delta;
        s.distance += metersThisFrame / 1000;
        s.score += Math.floor(metersThisFrame * 0.4 * s.combo);

        setScore(s.score);
        setDistance(Number(s.distance.toFixed(1)));
        setSpeed(Math.round(s.currentSpeed));
        setCombo(s.combo);

        // Smooth lane switching
        playerCar.position.x = THREE.MathUtils.lerp(playerCar.position.x, s.targetLaneX, delta * 12);
        // Subtle car roll while switching lanes
        const rollAngle = (s.targetLaneX - playerCar.position.x) * -0.06;
        playerCar.rotation.z = THREE.MathUtils.lerp(playerCar.rotation.z, rollAngle, delta * 10);

        // Road stripes movement
        const roadMove = ((s.currentSpeed * 1000) / 3600) * delta;
        stripes.forEach((stripe) => {
          stripe.position.z += roadMove;
          if (stripe.position.z > 20) {
            stripe.position.z -= 18 * (stripeCount / 2);
          }
        });

        // Obstacles movement & collision detection
        obstacles.forEach((obs) => {
          const relativeSpeed = ((s.currentSpeed - obs.speed) * 1000) / 3600;
          obs.mesh.position.z += relativeSpeed * delta;

          // Check if player passed obstacle safely -> Combo bonus
          if (!obs.passed && obs.mesh.position.z > playerCar.position.z + 2) {
            obs.passed = true;
            s.combo = Math.min(s.combo + 1, 8);
          }

          // Respawn obstacle ahead
          if (obs.mesh.position.z > 25) {
            obs.lane = [-1, 0, 1][Math.floor(Math.random() * 3)];
            obs.mesh.position.x = obs.lane * LANE_WIDTH;
            obs.mesh.position.z = -180 - Math.random() * 80;
            obs.speed = 35 + Math.random() * 40;
            obs.passed = false;
          }

          // AABB Collision Detection
          const dx = Math.abs(playerCar.position.x - obs.mesh.position.x);
          const dz = Math.abs(playerCar.position.z - obs.mesh.position.z);
          if (dx < 1.7 && dz < 3.4) {
            // CRASH!
            soundFX.stopEngine();
            soundFX.playCrash();
            soundFX.playGameOver();

            s.gameState = 'gameover';
            setGameState('gameover');
          }
        });

        // Camera follow & subtle speed shake
        const shake = (Math.random() - 0.5) * (s.isBoosting ? 0.06 : 0.02);
        camera.position.x = playerCar.position.x * 0.45 + shake;
        camera.position.y = 3.8 + (s.isBoosting ? -0.2 : 0);
      }

      renderer.render(scene, camera);
    };

    loop();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      soundFX.stopEngine();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, carColorHex, teamLogoText]);

  const handleLeaderboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;
    const entry: LeaderboardEntry = {
      id: `lb-${Date.now()}`,
      nickname: playerNickname.trim() || 'CosmicPilot',
      score,
      distance,
      date: new Date().toISOString().split('T')[0],
    };
    onNewScore(entry);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#030712] rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col shadow-2xl">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-slate-900/60 z-20">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></div>
            <div>
              <h2 className="text-sm font-bold font-display text-white tracking-wider">
                ASTRA LAB: 3D CYBER HIGHWAY RACER
              </h2>
              <span className="text-xs text-cyan-400 font-mono">
                {teamLogoText} // NASA Space Apps 2026 Lab
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {gameState === 'playing' && (
              <button
                onClick={handlePauseToggle}
                className="px-3 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-white/10"
              >
                إيقاف مؤقت [P]
              </button>
            )}
            <button
              onClick={() => {
                soundFX.stopEngine();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <div ref={mountRef} className="w-full h-full" />

          {/* HUD OVERLAY (During gameplay) */}
          {gameState === 'playing' && (
            <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none z-10">
              {/* Score & Combo */}
              <div className="glass-panel px-4 py-2 rounded-xl border border-cyan-500/20">
                <div className="text-xs text-slate-400 font-mono">SCORE</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{score}</div>
                {combo > 1 && (
                  <div className="text-xs font-bold text-amber-400 animate-bounce">
                    COMBO ×{combo}
                  </div>
                )}
              </div>

              {/* Speedometer */}
              <div className="glass-panel px-4 py-2 rounded-xl border border-cyan-500/20 text-center">
                <div className="text-xs text-slate-400 font-mono">SPEED</div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {speed} <span className="text-xs text-cyan-400 font-normal">KM/H</span>
                </div>
              </div>

              {/* Distance & High Score */}
              <div className="glass-panel px-4 py-2 rounded-xl border border-cyan-500/20 text-right">
                <div className="text-xs text-slate-400 font-mono">DISTANCE</div>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {distance} <span className="text-xs text-slate-300 font-normal">KM</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  BEST: {Math.max(highScore, score)}
                </div>
              </div>
            </div>
          )}

          {/* START / IDLE OVERLAY */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="max-w-md w-full glass-panel-glow p-8 rounded-2xl border border-cyan-500/40 space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 text-xs font-mono text-cyan-400 bg-cyan-950/60 rounded-full border border-cyan-800 mb-3">
                    EXPERIMENTAL 3D SIMULATION
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">مختبر قيادة المركبة الفضائية</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    قد مركبة الفريق على الطريق الكوني فائق السرعة، تفادَ الحواجز والمركبات، واستخدم النيترو لتحقيق أعلى نقاط!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left text-xs bg-slate-900/80 p-3 rounded-lg border border-white/5 font-mono">
                  <div>
                    <span className="text-cyan-400">← / A :</span> حارة اليسار
                  </div>
                  <div>
                    <span className="text-cyan-400">→ / D :</span> حارة اليمين
                  </div>
                  <div className="col-span-2">
                    <span className="text-amber-400">SPACE / ↑ :</span> تعزيز النيترو (Nitro Boost)
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_25px_rgba(6,182,212,0.6)]"
                >
                  انطلق في السباق الآن (START RACE)
                </button>
              </div>
            </div>
          )}

          {/* PAUSED OVERLAY */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="glass-panel p-8 rounded-2xl border border-white/20 space-y-4">
                <h3 className="text-xl font-bold text-white font-display">المحاكاة متوقفة مؤقتاً</h3>
                <button
                  onClick={handlePauseToggle}
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-cyan-500 text-black hover:bg-cyan-400 transition-all"
                >
                  استئناف القيادة
                </button>
              </div>
            </div>
          )}

          {/* GAME OVER OVERLAY */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="max-w-md w-full glass-panel-glow p-8 rounded-2xl border border-red-500/40 space-y-6">
                <div>
                  <div className="text-red-400 font-mono text-sm tracking-widest font-bold">COLLISION DETECTED</div>
                  <h3 className="text-3xl font-extrabold text-white font-display mt-1">انتهى السباق!</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-white/10 font-mono">
                  <div>
                    <div className="text-xs text-slate-400">النقاط المحققة</div>
                    <div className="text-2xl font-bold text-cyan-400 tabular-nums">{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">المسافة المقطوعة</div>
                    <div className="text-2xl font-bold text-amber-400 tabular-nums">{distance} KM</div>
                  </div>
                </div>

                {/* Submit to Leaderboard form */}
                {!submitted ? (
                  <form onSubmit={handleLeaderboardSubmit} className="space-y-3">
                    <label className="block text-xs text-slate-300 text-right">
                      سجل اسمك في لوحة المتصدرين العالمية:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerNickname}
                        onChange={(e) => setPlayerNickname(e.target.value)}
                        placeholder="اللقب أو الاسم..."
                        maxLength={18}
                        className="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                      >
                        تسجيل النتيجة
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-xs text-emerald-400 font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-800">
                    ✓ تم تسجيل نتيجتك بنجاح في قائمة المتصدرين!
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleStart}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-black transition-all shadow-lg"
                  >
                    إعادة المحاولة (RESTART)
                  </button>
                  <button
                    onClick={() => {
                      soundFX.stopEngine();
                      onClose();
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    خروج
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE TOUCH CONTROLS (Only visible on touch screens or small viewports) */}
          {gameState === 'playing' && (
            <div className="absolute bottom-4 inset-x-4 flex justify-between items-center pointer-events-auto z-10 md:hidden">
              <div className="flex gap-2">
                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    moveLane(-1);
                  }}
                  className="w-14 h-14 rounded-full bg-slate-900/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-black font-bold text-xl shadow-lg backdrop-blur-sm"
                >
                  ←
                </button>
                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    moveLane(1);
                  }}
                  className="w-14 h-14 rounded-full bg-slate-900/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-black font-bold text-xl shadow-lg backdrop-blur-sm"
                >
                  →
                </button>
              </div>

              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerBoost(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  triggerBoost(false);
                }}
                className="w-16 h-16 rounded-full bg-amber-500/90 border border-amber-300 text-black font-black text-xs flex items-center justify-center active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
              >
                NITRO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
