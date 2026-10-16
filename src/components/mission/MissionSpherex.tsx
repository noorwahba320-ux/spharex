import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface MissionSpherexProps {
  challengeTitle?: string;
  challengeTrack?: string;
}

export const MissionSpherex: React.FC<MissionSpherexProps> = ({
  challengeTitle = 'NASA Space Apps Challenge 2026',
  challengeTrack = 'Planet X and SPHEREx',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 30, 45);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Procedural Coordinate Grid (RA / Dec Celestial Frame)
    const gridHelper = new THREE.GridHelper(50, 20, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Orbital Ellipses (Kuiper Belt & Planet X theoretical outer orbit)
    const createOrbitLine = (a: number, b: number, color: number, tilt = 0) => {
      const curve = new THREE.EllipseCurve(0, 0, a, b, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
      const line = new THREE.Line(geometry, material);
      line.rotation.x = tilt;
      return line;
    };

    const innerOrbit = createOrbitLine(12, 12, 0x38bdf8);
    const outerOrbit = createOrbitLine(22, 18, 0x64748b, 0.1);
    const planetXHypothetical = createOrbitLine(34, 24, 0xf59e0b, 0.35); // Inclined hypothetical orbit

    scene.add(innerOrbit);
    scene.add(outerOrbit);
    scene.add(planetXHypothetical);

    // Orbiting candidate marker on theoretical path
    const candidateGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const candidateMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const candidateMesh = new THREE.Mesh(candidateGeo, candidateMat);
    scene.add(candidateMesh);

    // Central Sun
    const sunGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime() * 0.25;

      // Position candidate along inclined ellipse
      const px = Math.cos(t) * 34;
      const pz = Math.sin(t) * 24;
      candidateMesh.position.set(px, Math.sin(t * 0.35) * 5, pz);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
    const domElement = renderer.domElement;
  }, []);

  return (
    <section id="mission" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <div className="text-xs font-mono text-cyan-400">CHALLENGE TRACK // SCIENTIFIC FRAMEWORK</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
          مهمة SPHEREx والبحث عن Planet X
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          تحدي {challengeTitle} حول المسح الطيفي الشامل للسماء بالأشعة تحت الحمراء والبحث الرياضي والفيزيائي عن الأجرام ما وراء نبتون.
        </p>
      </div>

      {/* 3D Celestial Orbit Visualization */}
      <div className="rounded-2xl bg-[#0b1016] border border-white/10 p-4 sm:p-6 mb-8 overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-2">
          <span>ORBITAL CELESTIAL PLANE // THREE.JS SIMULATION</span>
          <span className="text-amber-400">المدار الافتراضي لـ Planet X</span>
        </div>
        <div ref={canvasRef} className="w-full h-[320px] sm:h-[400px]" />
      </div>

      {/* Scientific Overview Cards (100% Real NASA concepts, no fake readings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0b1016] border border-white/10 space-y-3">
          <div className="text-xs font-mono text-cyan-400">01 // NASA SPHEREx MISSION</div>
          <h3 className="text-lg font-bold text-white font-display">
            تلسكوب المسح الطيفي لكون كامل
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            مهمة SPHEREx (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) هي مرصد فضائي تابع لوكالة ناسا مخصص لإجراء مسح طيفي شامل لجميع أنحاء السماء في نطاق الأشعة تحت الحمراء القريبة (0.75 - 5.0 ميكرومتر)، مما يساعد على فهم أصل الكون وتوزيع الجليد العضوي.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b1016] border border-white/10 space-y-3">
          <div className="text-xs font-mono text-amber-400">02 // PLANET X SEARCH</div>
          <h3 className="text-lg font-bold text-white font-display">
            فرضية الكوكب التاسع (Planet Nine)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            فرضية فلكية رياضية مبنية على الشذوذ المداري وتجمع مستويات مدارات أجرام حزام كايبر المتطرفة (Extreme TNOs). مسوح SPHEREx الطيفية الشاملة للأشعة تحت الحمراء الحرارية توفر أداة بحثية قوية لرصد الانبعاثات الحرارية الضعيفة لأي جسم كوكبي ضخم في أطراف النظام الشمسي.
          </p>
        </div>
      </div>
    </section>
  );
};
