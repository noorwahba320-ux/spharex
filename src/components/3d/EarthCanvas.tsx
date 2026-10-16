import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFX } from '../../lib/audio';

interface EarthCanvasProps {
  onEgyptFocused?: () => void;
  accentColor?: string;
  enableSound?: boolean;
}

export const EarthCanvas: React.FC<EarthCanvasProps> = ({
  onEgyptFocused,
  accentColor = '#f59e0b',
  enableSound = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocusingEgypt, setIsFocusingEgypt] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070a, 0.001);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1200
    );
    camera.position.set(0, 3.2, 25);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. PROCEDURAL HIGH-RESOLUTION PLANETARY TEXTURES
    const width = 2048;
    const height = 1024;

    // Daylight Surface & Ocean Specular Texture
    const dayCanvas = document.createElement('canvas');
    dayCanvas.width = width;
    dayCanvas.height = height;
    const dCtx = dayCanvas.getContext('2d')!;

    const oceanGrad = dCtx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0a1d37');
    oceanGrad.addColorStop(0.5, '#06162d');
    oceanGrad.addColorStop(1, '#040f20');
    dCtx.fillStyle = oceanGrad;
    dCtx.fillRect(0, 0, width, height);

    const drawLand = (cx: number, cy: number, rx: number, ry: number, fill = '#1c3828', coast = '#38341e') => {
      dCtx.beginPath();
      dCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      dCtx.fillStyle = fill;
      dCtx.fill();
      dCtx.strokeStyle = coast;
      dCtx.lineWidth = 14;
      dCtx.stroke();
    };

    const africaX = width * 0.585;
    const africaY = height * 0.56;
    drawLand(africaX, africaY, 185, 245, '#28361e', '#493e23'); // Africa
    drawLand(africaX + 45, africaY - 145, 110, 75, '#413c23', '#564d26'); // Middle East
    drawLand(africaX - 30, height * 0.32, 170, 95, '#1e382b', '#2c4230'); // Europe
    drawLand(width * 0.78, height * 0.38, 270, 170, '#1c3829', '#2e422b'); // Asia
    drawLand(width * 0.24, height * 0.35, 210, 145, '#1b3728', '#2d412b'); // North America
    drawLand(width * 0.32, height * 0.65, 125, 185, '#153521', '#254127'); // South America
    drawLand(width * 0.85, height * 0.72, 115, 85, '#443b22', '#534625'); // Australia

    // Egypt Nile River & Delta daylight geographic marking
    const egyptX = width * 0.586;
    const egyptY = height * 0.352;
    dCtx.strokeStyle = '#38bdf8';
    dCtx.lineWidth = 4;
    dCtx.beginPath();
    dCtx.moveTo(egyptX, egyptY + 40);
    dCtx.lineTo(egyptX + 4, egyptY + 12);
    dCtx.lineTo(egyptX - 2, egyptY - 8);
    dCtx.stroke();

    const dayTexture = new THREE.CanvasTexture(dayCanvas);
    dayTexture.colorSpace = THREE.SRGBColorSpace;

    // Nighttime Texture Map (City Light Clusters)
    const nightCanvas = document.createElement('canvas');
    nightCanvas.width = width;
    nightCanvas.height = height;
    const nCtx = nightCanvas.getContext('2d')!;
    nCtx.fillStyle = '#010309';
    nCtx.fillRect(0, 0, width, height);

    const addCityLights = (cx: number, cy: number, r: number, color: string) => {
      const grad = nCtx.createRadialGradient(cx, cy, 1, cx, cy, r);
      grad.addColorStop(0, color);
      grad.addColorStop(0.35, 'rgba(251, 191, 36, 0.55)');
      grad.addColorStop(0.8, 'rgba(245, 158, 11, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nCtx.fillStyle = grad;
      nCtx.beginPath();
      nCtx.arc(cx, cy, r, 0, Math.PI * 2);
      nCtx.fill();
    };

    // Egypt Nile Delta & Cairo glowing night network
    addCityLights(egyptX, egyptY, 36, 'rgba(254, 240, 138, 0.98)');
    addCityLights(egyptX + 2, egyptY + 16, 22, 'rgba(251, 191, 36, 0.85)');
    addCityLights(egyptX + 1, egyptY + 32, 18, 'rgba(245, 158, 11, 0.75)');

    // Global urban night corridors
    addCityLights(africaX - 35, height * 0.31, 34, 'rgba(251, 191, 36, 0.8)'); // Europe
    addCityLights(africaX + 70, height * 0.42, 36, 'rgba(251, 191, 36, 0.85)'); // Gulf
    addCityLights(width * 0.72, height * 0.46, 40, 'rgba(251, 191, 36, 0.75)'); // South Asia
    addCityLights(width * 0.84, height * 0.36, 38, 'rgba(251, 191, 36, 0.8)'); // East Asia
    addCityLights(width * 0.28, height * 0.34, 42, 'rgba(251, 191, 36, 0.85)'); // North America

    const nightTexture = new THREE.CanvasTexture(nightCanvas);
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // Volumetric Cloud Maps
    const createCloudMap = (density: number) => {
      const cCanvas = document.createElement('canvas');
      cCanvas.width = 1024;
      cCanvas.height = 512;
      const cCtx = cCanvas.getContext('2d')!;
      cCtx.fillStyle = '#000000';
      cCtx.fillRect(0, 0, 1024, 512);

      cCtx.fillStyle = 'rgba(255, 255, 255, 0.46)';
      for (let i = 0; i < density; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = 20 + Math.random() * 55;
        cCtx.beginPath();
        cCtx.arc(x, y, r, 0, Math.PI * 2);
        cCtx.fill();
      }
      const tex = new THREE.CanvasTexture(cCanvas);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    const cloudTex1 = createCloudMap(100);
    const cloudTex2 = createCloudMap(75);

    // EARTH GLOBE GROUP
    const earthRadius = 7.5;
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 3. DYNAMIC ORBITING POINTLIGHT (DAY/NIGHT SUNLIGHT SOURCE)
    const sunDistance = 65;
    const pointLight = new THREE.PointLight(0xfffaed, 3.5, 260, 0.4);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x0c1322, 0.45);
    scene.add(ambientLight);

    // 4. EARTH SURFACE SHADER (DAY/NIGHT BLEND + SPECULAR OCEANS + FRESNEL HORIZON)
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunPosition: { value: new THREE.Vector3(sunDistance, 10, 30) },
        cameraPos: { value: camera.position },
      },
      vertexShader: `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        varying vec3 vViewDir;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;
        uniform vec3 cameraPos;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        varying vec3 vViewDir;

        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;

          vec3 lightDir = normalize(sunPosition - vWorldPosition);
          float NdotL = dot(vWorldNormal, lightDir);

          // Day/Night blend across the terminator line
          float dayFactor = smoothstep(-0.15, 0.22, NdotL);

          // Sunset twilight scattering along terminator
          float twilight = smoothstep(-0.25, 0.05, NdotL) * (1.0 - smoothstep(0.05, 0.3, NdotL));
          vec3 twilightColor = vec3(0.96, 0.58, 0.2) * twilight * 0.4;

          // Specular highlight on ocean surface
          vec3 halfVec = normalize(lightDir + vViewDir);
          float spec = pow(max(dot(vWorldNormal, halfVec), 0.0), 28.0) * 0.55 * dayFactor;
          vec3 specular = vec3(0.85, 0.95, 1.0) * spec;

          // Surface combination
          vec3 surface = mix(nightColor * 1.5, dayColor + twilightColor + specular, dayFactor);

          // Atmospheric Fresnel scattering on illuminated surface edge
          float surfaceFresnel = pow(1.0 - max(dot(vWorldNormal, vViewDir), 0.0), 3.2);
          surface += vec3(0.15, 0.65, 0.95) * surfaceFresnel * dayFactor * 0.45;

          gl_FragColor = vec4(surface, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
    earthGroup.add(earthMesh);

    // 5. VOLUMETRIC CLOUD STRATA (ALPHA BLENDING FOR SCIENTIFIC DEPTH)
    const cloudGeo1 = new THREE.SphereGeometry(earthRadius + 0.09, 48, 48);
    const cloudMat1 = new THREE.MeshStandardMaterial({
      alphaMap: cloudTex1,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: 0xffffff,
    });
    const cloudMesh1 = new THREE.Mesh(cloudGeo1, cloudMat1);
    earthGroup.add(cloudMesh1);

    const cloudGeo2 = new THREE.SphereGeometry(earthRadius + 0.18, 48, 48);
    const cloudMat2 = new THREE.MeshStandardMaterial({
      alphaMap: cloudTex2,
      transparent: true,
      opacity: 0.32,
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: 0xe2e8f0,
    });
    const cloudMesh2 = new THREE.Mesh(cloudGeo2, cloudMat2);
    earthGroup.add(cloudMesh2);

    // 6. REALISTIC ATMOSPHERE FRESNEL SHADER (RAYLEIGH / MIE SCATTERING)
    const atmosGeo = new THREE.SphereGeometry(earthRadius + 0.85, 48, 48);
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: {
        sunPosition: { value: pointLight.position },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sunPosition;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;

        void main() {
          float fresnel = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);

          vec3 lightDir = normalize(sunPosition);
          float sunDot = dot(vWorldNormal, lightDir);
          float dayFactor = smoothstep(-0.25, 0.35, sunDot);

          vec3 dayAtmosphere = vec3(0.1, 0.72, 0.98);
          vec3 sunsetAtmosphere = vec3(0.98, 0.52, 0.18);
          vec3 nightAtmosphere = vec3(0.02, 0.08, 0.18) * 0.2;

          vec3 scatter = mix(nightAtmosphere, mix(sunsetAtmosphere, dayAtmosphere, dayFactor), dayFactor);

          gl_FragColor = vec4(scatter * fresnel * 2.2, fresnel * 0.9);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // 7. PRECISE EGYPT GEODETIC COORDINATE MARKER (PURE PROCEDURAL THREE.JS LOGIC)
    // Real geodetic coordinates: Latitude 26.8206° N, Longitude 30.8025° E
    const lat = 26.8206;
    const lon = 30.8025;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -earthRadius * Math.sin(phi) * Math.cos(theta);
    const y = earthRadius * Math.cos(phi);
    const z = earthRadius * Math.sin(phi) * Math.sin(theta);
    const egyptPos = new THREE.Vector3(x, y, z);
    const surfaceNormal = egyptPos.clone().normalize();

    const egyptReticleGroup = new THREE.Group();
    egyptReticleGroup.position.copy(egyptPos);
    egyptReticleGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);
    earthGroup.add(egyptReticleGroup);

    // Geodesic Target Ring 1 (Inner reticle)
    const innerRingGeo = new THREE.RingGeometry(0.16, 0.24, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.04;
    egyptReticleGroup.add(innerRing);

    // Geodesic Target Ring 2 (Outer range reticle)
    const outerRingGeo = new THREE.RingGeometry(0.38, 0.44, 32);
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.04;
    egyptReticleGroup.add(outerRing);

    // Cardinal Reticle Crosshair Ticks
    const tickMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
    const createTick = (x1: number, z1: number, x2: number, z2: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, 0.04, z1),
        new THREE.Vector3(x2, 0.04, z2),
      ]);
      return new THREE.Line(geo, tickMat);
    };
    egyptReticleGroup.add(createTick(0, 0.24, 0, 0.52)); // North tick
    egyptReticleGroup.add(createTick(0, -0.24, 0, -0.52)); // South tick
    egyptReticleGroup.add(createTick(0.24, 0, 0.52, 0)); // East tick
    egyptReticleGroup.add(createTick(-0.24, 0, -0.52, 0)); // West tick

    // Zenith Axis Normal Vector
    const zenithGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.04, 0),
      new THREE.Vector3(0, 0.85, 0),
    ]);
    const zenithLine = new THREE.Line(
      zenithGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
    );
    egyptReticleGroup.add(zenithLine);

    // Concentric Wave Ring for procedural radial pulse
    const pulseRingGeo = new THREE.RingGeometry(0.2, 0.3, 32);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const pulseWave = new THREE.Mesh(pulseRingGeo, pulseMat);
    pulseWave.rotation.x = Math.PI / 2;
    pulseWave.position.y = 0.05;
    egyptReticleGroup.add(pulseWave);

    // High-Resolution 3D Vector Text Sprite (Rendered directly in Three.js without DOM overlay)
    const createCoordinateSprite = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d')!;

      // Crisp background pill
      ctx.fillStyle = 'rgba(11, 16, 22, 0.85)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(10, 10, 492, 140, 24);
      ctx.fill();
      ctx.stroke();

      // Technical Header
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 34px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EGYPT HQ // 26°49\'N · 30°48\'E', 256, 68);

      // Sub-label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '26px "Tajawal", sans-serif';
      ctx.fillText('فريق NASA Space Apps Challenge', 256, 118);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.2, 1.0, 1.0);
      sprite.position.set(0, 1.35, 0);
      return sprite;
    };

    const coordSprite = createCoordinateSprite();
    egyptReticleGroup.add(coordSprite);

    // 8. BACKGROUND CELESTIAL STARS
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const rad = 120 + Math.random() * 200;
      const u = Math.random();
      const v = Math.random();
      const th = u * 2.0 * Math.PI;
      const ph = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * rad;
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPos[i * 3 + 2] = r * Math.cos(ph);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Initial orientation: Center Egypt towards camera
    earthGroup.rotation.y = 1.35;
    earthGroup.rotation.x = 0.22;

    // 9. SMOOTH DAMPING CONTROLS & TOUCH GESTURES
    let isPointerDown = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0.0015;
    let targetZoom = camera.position.z;
    let initialPinchDist = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      velY = dx * 0.0035;
      velX = dy * 0.0028;

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        targetZoom += (initialPinchDist - dist) * 0.035;
        targetZoom = THREE.MathUtils.clamp(targetZoom, 13, 36);
        initialPinchDist = dist;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDist = 0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom += e.deltaY * 0.015;
      targetZoom = THREE.MathUtils.clamp(targetZoom, 13, 36);
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: false });
    dom.addEventListener('touchend', onTouchEnd);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Focus Egypt method (Triggered via custom event from UI or double-click)
    const focusOnEgypt = () => {
      setIsFocusingEgypt(true);
      if (enableSound) soundFX.playPulse();

      const targetRotY = 1.15;
      const targetRotX = 0.28;
      targetZoom = 17;

      let step = 0;
      const animateToEgypt = () => {
        step++;
        earthGroup.rotation.y = THREE.MathUtils.lerp(earthGroup.rotation.y, targetRotY, 0.07);
        earthGroup.rotation.x = THREE.MathUtils.lerp(earthGroup.rotation.x, targetRotX, 0.07);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZoom, 0.07);

        if (step < 60) {
          requestAnimationFrame(animateToEgypt);
        } else {
          setIsFocusingEgypt(false);
          onEgyptFocused?.();
        }
      };
      animateToEgypt();
    };

    const handleCustomFocus = () => focusOnEgypt();
    window.addEventListener('focus-egypt-earth', handleCustomFocus);

    // Double-click on canvas focuses Egypt
    dom.addEventListener('dblclick', () => focusOnEgypt());

    // 10. ANIMATION & REAL-TIME DYNAMICS LOOP
    let animId: number;
    let clock = new THREE.Clock();
    let sunAngle = 0.8;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Orbiting PointLight simulating Keplerian day/night cycle
      sunAngle += delta * 0.08;
      const sunX = Math.cos(sunAngle) * sunDistance;
      const sunZ = Math.sin(sunAngle) * sunDistance;
      const sunY = Math.sin(sunAngle * 0.5) * 16;
      pointLight.position.set(sunX, sunY, sunZ);

      // Update shader uniforms
      earthMaterial.uniforms.sunPosition.value.copy(pointLight.position);
      earthMaterial.uniforms.cameraPos.value.copy(camera.position);
      atmosMat.uniforms.sunPosition.value.copy(pointLight.position);

      // Inertial Earth Rotation
      if (!isPointerDown && !isFocusingEgypt) {
        velY = THREE.MathUtils.lerp(velY, 0.0014, 0.02);
        velX *= 0.94;
      }
      earthGroup.rotation.y += velY;
      earthGroup.rotation.x = THREE.MathUtils.clamp(earthGroup.rotation.x + velX, -Math.PI / 3, Math.PI / 3);

      // Volumetric cloud layer rotation
      cloudMesh1.rotation.y += 0.00035;
      cloudMesh2.rotation.y += 0.00065;

      // Pulse wave expanding radially across the surface
      const pulseProgress = (elapsed * 0.8) % 2.0;
      const waveScale = 1.0 + pulseProgress * 2.2;
      const waveOpacity = Math.max(0, 1.0 - pulseProgress / 2.0) * 0.8;
      pulseWave.scale.set(waveScale, waveScale, 1);
      pulseMat.opacity = waveOpacity;

      // Smooth camera zoom damping
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZoom, 0.08);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('focus-egypt-earth', handleCustomFocus);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      dom.removeEventListener('wheel', onWheel);

      cancelAnimationFrame(animId);
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, [accentColor, enableSound, onEgyptFocused]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] lg:min-h-[660px] cursor-grab active:cursor-grabbing select-none"
    />
  );
};
