'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Gem, Compass, ShieldCheck, ChevronDown } from 'lucide-react';
import { createDeformableNecklace, type DeformableNecklaceController } from './DeformableNecklace';
import { createStudioEnvironment, setupLuxuryStudioLighting } from './StudioLighting';
import { isWebGLSupported, prefersReducedMotion } from '@/lib/utils';

export function HeroScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);

  // Editorial caption refs for scroll-synchronized narrative on the LEFT
  const textPhase1Ref = useRef<HTMLDivElement>(null);
  const textPhase2Ref = useRef<HTMLDivElement>(null);
  const textPhase3Ref = useRef<HTMLDivElement>(null);
  const textPhase4Ref = useRef<HTMLDivElement>(null);
  const textPhase5Ref = useRef<HTMLDivElement>(null);

  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene & Fixed Framing Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080807);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Camera is framed stably at Z = 6.5 with zero continuous orbit or shake
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. High-End Studio Environment & Physical Softbox Reflections
    const studioEnvRenderTarget = createStudioEnvironment(renderer);
    scene.environment = studioEnvRenderTarget.texture;

    // Direct lighting rig (stable, no erratic flicker)
    const { keyLight, fillLight, rimLight } = setupLuxuryStudioLighting(scene);

    // 3. Floating Gold Micro-Particles (Ambient Depth)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xF4CB58,
      size: 0.034,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Hero 3D Deformable Gold Necklace & Exploded Assembly
    const necklace: DeformableNecklaceController = createDeformableNecklace('yellow_gold');
    scene.add(necklace.group);
    scene.add(necklace.surfaceMesh);

    // Dynamic right-side anchor and scale calculator
    const getAnchorX = (aspect: number) => {
      if (aspect >= 1.5) return 2.05; // Desktop wide: cleanly anchored on the right side
      if (aspect >= 1.1) return 1.60; // Laptop / medium desktop
      if (aspect >= 0.85) return 1.10; // Tablet landscape
      return 0.0; // Mobile portrait: centered to prevent clipping
    };

    const getModelScale = (aspect: number) => {
      if (aspect >= 1.5) return 1.12;
      if (aspect >= 1.1) return 1.02;
      if (aspect >= 0.85) return 0.90;
      return 0.74; // Compact scale on mobile so complete necklace has ample margins
    };

    // Normalized scroll progress tracker
    const scrollObj = { progress: 0 };

    // Set initial Phase 1 resting state immediately
    const initialAspect = camera.aspect;
    const initialAnchorX = getAnchorX(initialAspect);
    const initialScale = getModelScale(initialAspect);

    necklace.group.scale.set(initialScale, initialScale, initialScale);
    necklace.group.position.set(initialAnchorX, -0.28, -0.35);
    necklace.group.rotation.set(-1.20, 0.04, 0.0);

    necklace.surfaceMesh.scale.set(initialScale, initialScale, initialScale);
    necklace.surfaceMesh.position.set(initialAnchorX, -0.36, -0.35);
    necklace.surfaceMesh.rotation.set(-1.20, 0.04, 0.0);
    (necklace.surfaceMesh.material as THREE.Material).opacity = 1.0;

    necklace.updateScrollProgress(0, initialAspect);

    // 5. Master GSAP ScrollTrigger Scrub Timeline
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // If reduced motion is preferred, present an upright fully assembled view
        necklace.group.position.set(initialAnchorX, -0.05, 0);
        necklace.group.rotation.set(0, 0, 0);
        necklace.updateScrollProgress(0, camera.aspect);
        (necklace.surfaceMesh.material as THREE.Material).opacity = 0;
        return;
      }

      if (pinnedSectionRef.current) {
        // Single master pinned scroll sequence across the 5 phases
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedSectionRef.current,
            start: 'top top',
            end: '+=400%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              scrollObj.progress = self.progress;

              // Gracefully fade out canvas as animation completes near p >= 0.96
              if (canvasContainerRef.current) {
                if (self.progress >= 0.96) {
                  const fade = Math.min(1, (self.progress - 0.96) / 0.038);
                  canvasContainerRef.current.style.opacity = String(Math.max(0, 1 - fade));
                } else {
                  canvasContainerRef.current.style.opacity = '1';
                }
              }
            },
            onLeave: () => {
              // 1. COMPLETION: Remove the necklace element from the background entirely
              if (canvasContainerRef.current) {
                canvasContainerRef.current.style.opacity = '0';
                canvasContainerRef.current.style.visibility = 'hidden';
                canvasContainerRef.current.style.pointerEvents = 'none';
              }
            },
            onEnterBack: () => {
              // Restore necklace when scrolling back up into the hero sequence
              if (canvasContainerRef.current) {
                canvasContainerRef.current.style.visibility = 'visible';
                canvasContainerRef.current.style.opacity = '1';
              }
            },
          },
        });

        // Coordinated Editorial Typography Transitions on the LEFT
        // Phase 1 (0 -> 0.18): Hero Headline
        // Phase 2 (0.22 -> 0.38): Necklace Stands Upright
        // Phase 3 (0.42 -> 0.68): Exploded Anatomy (holds during max explosion plateau)
        // Phase 4 (0.72 -> 0.88): Precision Reassembly
        // Phase 5 (0.92 -> 1.0): Permanent Final Hold & Heirloom Legacy
        tl.to(textPhase1Ref.current, { opacity: 0, y: -25, duration: 0.15 }, 0.16)
          .fromTo(textPhase2Ref.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.15 }, 0.22)
          .to(textPhase2Ref.current, { opacity: 0, y: -25, duration: 0.15 }, 0.38)
          .fromTo(textPhase3Ref.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.15 }, 0.44)
          .to(textPhase3Ref.current, { opacity: 0, y: -25, duration: 0.15 }, 0.68)
          .fromTo(textPhase4Ref.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.15 }, 0.74)
          .to(textPhase4Ref.current, { opacity: 0, y: -25, duration: 0.15 }, 0.88)
          .fromTo(textPhase5Ref.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.15 }, 0.93);
      }
    }, containerRef);

    // 6. Fully Deterministic Render Loop (Strict Zero-Drift, Pure Progress Mapping)
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Skip render when necklace canvas is hidden upon completion of animation sequence
      if (canvasContainerRef.current && canvasContainerRef.current.style.visibility === 'hidden') {
        return;
      }

      const aspect = camera.aspect;
      const anchorX = getAnchorX(aspect);
      const scale = getModelScale(aspect);

      necklace.group.scale.set(scale, scale, scale);
      necklace.surfaceMesh.scale.set(scale, scale, scale);

      // Clamp progress: if user scrolls farther down past the pinned section, p remains 1.0
      // Locking the necklace into its Phase 5 permanent final hold!
      const p = THREE.MathUtils.clamp(scrollObj.progress, 0, 1);

      // ─── 5-PHASE DETERMINISTIC TRANSFORMS ─────────────────────────────────
      if (p <= 0.30) {
        // ── PHASE 1 & 2: LAID-DOWN RESTING -> STANDING UPRIGHT (p: 0 -> 0.30)
        // Authentic 3D lifting around base pivot from horizontal resting to vertical presentation
        const tLift = THREE.MathUtils.clamp(p / 0.30, 0, 1);
        const eLift = THREE.MathUtils.smoothstep(tLift, 0, 1);

        // Group Rotation: smoothly lifts from -1.20 rad (-68.75 deg) down-tilt to 0 (upright)
        necklace.group.rotation.x = THREE.MathUtils.lerp(-1.20, 0.0, eLift);
        necklace.group.rotation.y = THREE.MathUtils.lerp(0.04, 0.0, eLift);
        necklace.group.rotation.z = 0.0;

        // Group Position: strictly stays at anchorX on the right side!
        necklace.group.position.x = anchorX;
        necklace.group.position.y = THREE.MathUtils.lerp(-0.28, -0.05, eLift);
        necklace.group.position.z = THREE.MathUtils.lerp(-0.35, 0.0, eLift);

        // Presentation surface tray matches initial resting plane and fades as necklace lifts
        necklace.surfaceMesh.position.set(anchorX, -0.36, -0.35);
        necklace.surfaceMesh.rotation.set(-1.20, 0.04, 0.0);
        (necklace.surfaceMesh.material as THREE.Material).opacity = 1.0 - eLift;
        necklace.surfaceMesh.visible = eLift < 0.98;

        // Exploded parts: ZERO expansion. 100% assembled unit
        necklace.setExplodedState(0, aspect);
      } else if (p <= 0.70) {
        // ── PHASE 3: EXPLODED COMPONENT ANIMATION (p: 0.30 -> 0.70)
        // Upright standing, separated 3D components with plateau pause at maximum expansion
        necklace.group.rotation.set(0.0, 0.0, 0.0);
        necklace.group.position.set(anchorX, -0.05, 0.0);
        necklace.surfaceMesh.visible = false;

        let explodeFactor = 0;
        if (p <= 0.54) {
          // Smooth progressive explosion outward along calculated 3D vectors
          explodeFactor = THREE.MathUtils.smoothstep(p, 0.30, 0.54);
        } else {
          // DELIBERATE PAUSE AT MAXIMUM EXPANSION (p: 0.54 -> 0.70)
          // Users can appreciate each tier of gold, diamonds, and sapphire craftsmanship!
          explodeFactor = 1.0;
        }

        necklace.setExplodedState(explodeFactor, aspect);
      } else if (p < 0.94) {
        // ── PHASE 4: PRECISION REASSEMBLY (p: 0.70 -> 0.94)
        // Returning every component smoothly to its exact original assembled transform
        necklace.group.rotation.set(0.0, 0.0, 0.0);
        necklace.group.position.set(anchorX, -0.05, 0.0);
        necklace.surfaceMesh.visible = false;

        const reassembly = THREE.MathUtils.smoothstep(p, 0.70, 0.94);
        const explodeFactor = 1.0 - reassembly;

        necklace.setExplodedState(explodeFactor, aspect);
      } else {
        // ── PHASE 5: PERMANENT FINAL HOLD (p >= 0.94 and ALL further scrolling)
        // Hard-locked completed state: completely motionless, upright, assembled on the right side!
        // NO idle rotation, NO bobbing, NO floating, NO breathing, NO auto-spin, NO parallax movement!
        necklace.group.rotation.set(0.0, 0.0, 0.0);
        necklace.group.position.set(anchorX, -0.05, 0.0);
        necklace.surfaceMesh.visible = false;

        necklace.setExplodedState(0, aspect);
      }

      // Micro particle ambient drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.002;
        if (positions[i] > 6) positions[i] = -6;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Viewport Resize Handler with Immediate Projection Matrix Sync
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      ctx.revert();
      studioEnvRenderTarget.dispose();
      necklace.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hasWebGL]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#080807]">
      {/* 3D Fixed Background Canvas (Strictly positioned, covers the hero experience) */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 pointer-events-none z-10 w-full h-full"
        style={{ opacity: hasWebGL ? 1 : 0 }}
      />

      {/* ========================================================================= */}
      {/* MASTER PINNED 5-PHASE CINEMATIC STORYBOARD */}
      {/* Pinned from the very top of the page, scrubbed smoothly over 400vh scroll */}
      {/* ========================================================================= */}
      <section
        ref={pinnedSectionRef}
        className="relative h-screen w-full flex items-center justify-between z-20 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-8"
      >
        {/* Left Container: Reserved exclusively for Editorial Storytelling & Typography */}
        <div className="w-full lg:w-1/2 max-w-xl relative z-30 select-none">
          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* PHASE 1: INITIAL RESTING POSITION (p = 0) */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          <div ref={textPhase1Ref} className="transition-opacity">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A45C]/30 bg-[#C9A45C]/5 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E9D5A0] font-medium">
                Haute Joaillerie Atelier
              </span>
            </div>

            <h1
              className="text-display-lg font-light text-[#F5F0E7] tracking-tight leading-[1.05] mb-5"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Jewellery That Becomes <br />
              <span className="text-gold-gradient italic">Your Legacy.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#A8A197] font-light mb-7 leading-relaxed">
              Exceptional craftsmanship. Timeless brilliance. Each bespoke necklace is forged in solid 22K gold by master artisans for life’s most profound milestones.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link href="/products" className="btn-primary pointer-events-auto">
                <span>Explore Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/collections" className="btn-secondary pointer-events-auto">
                View Collections
              </Link>
            </div>

            {/* Hallmarks */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[rgba(201,164,92,0.14)]">
              <div>
                <span className="block text-xl font-light text-[#E9D5A0] font-serif">22K</span>
                <span className="text-[10px] uppercase tracking-wider text-[#A8A197]/80">Solid Gold</span>
              </div>
              <div>
                <span className="block text-xl font-light text-[#E9D5A0] font-serif">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#A8A197]/80">Conflict-Free</span>
              </div>
              <div>
                <span className="block text-xl font-light text-[#E9D5A0] font-serif">Artisan</span>
                <span className="text-[10px] uppercase tracking-wider text-[#A8A197]/80">Hand-Linked</span>
              </div>
            </div>

            {/* Scroll Indicator Cue */}
            <div className="flex items-center gap-2 mt-8 text-[11px] uppercase tracking-widest text-[#C9A45C]/70">
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#C9A45C]" />
              <span>Scroll down to lift and inspect the creation</span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* PHASE 2: NECKLACE STANDS UPRIGHT (p ≈ 0.25) */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          <div
            ref={textPhase2Ref}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A45C]/30 bg-[#C9A45C]/5 mb-4 self-start">
              <Compass className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E9D5A0] font-medium">
                Phase 02 — Sculptural Elevation
              </span>
            </div>

            <h2
              className="text-display-md font-light text-[#F5F0E7] leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              “Elegance in <span className="text-gold-gradient italic">Motion.</span>”
            </h2>

            <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-6 font-light">
              Rising gracefully from its presentation tray into an upright royal display. Eighty-four articulated curb links lift and drape in continuous harmony, retaining flawless balance around the center axis.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#E9D5A0]/80 tracking-wide">
              <span className="px-3 py-1 border border-[#C9A45C]/25 bg-[#14120E]">3D Lifting Pivot</span>
              <span className="px-3 py-1 border border-[#C9A45C]/25 bg-[#14120E]">Articulated Curb Links</span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* PHASE 3: EXPLODED COMPONENT ANIMATION (p ≈ 0.50) */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          <div
            ref={textPhase3Ref}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A45C]/30 bg-[#C9A45C]/5 mb-4 self-start">
              <Gem className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E9D5A0] font-medium">
                Phase 03 — Exploded Anatomy
              </span>
            </div>

            <h2
              className="text-display-md font-light text-gold-gradient leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              “The Anatomy of 22K Craftsmanship.”
            </h2>

            <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-6 font-light">
              Observe each distinct tier separating along dedicated 3D axes: the jaali backplate, granulation medallion, Kundan 8-petal gallery, stepped bezel collar, and the natural Royal Blue Sapphire centerpiece.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#E9D5A0]/90">
              <div className="p-2.5 border border-[#C9A45C]/20 bg-[#11100E]/70">
                <span className="text-[#C9A45C] font-semibold block mb-0.5">Royal Sapphire</span>
                <span className="text-[11px] text-[#A8A197]">Hand-faceted cabochon crown</span>
              </div>
              <div className="p-2.5 border border-[#C9A45C]/20 bg-[#11100E]/70">
                <span className="text-[#C9A45C] font-semibold block mb-0.5">8-Petal Jaali</span>
                <span className="text-[11px] text-[#A8A197]">Kundan loops with diamond tips</span>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* PHASE 4: REASSEMBLY (p ≈ 0.80) */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          <div
            ref={textPhase4Ref}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A45C]/30 bg-[#C9A45C]/5 mb-4 self-start">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E9D5A0] font-medium">
                Phase 04 — Precision Reassembly
              </span>
            </div>

            <h2
              className="text-display-md font-light text-gold-gradient leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              “Unified into Timeless Perfection.”
            </h2>

            <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-6 font-light">
              Every exploded tier, gemstone setting, and articulated link returns smoothly to its exact wearable seat. Flawless alignment with zero clearance gap or deformation.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#E9D5A0]/80 tracking-wide">
              <span className="px-3 py-1 border border-[#C9A45C]/25 bg-[#14120E]">Micro-Tolerance Seating</span>
              <span className="px-3 py-1 border border-[#C9A45C]/25 bg-[#14120E]">Harmonic Unity</span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* PHASE 5: PERMANENT FINAL HOLD (p ≥ 0.95) */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          <div
            ref={textPhase5Ref}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A45C]/30 bg-[#C9A45C]/5 mb-4 self-start">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E9D5A0] font-medium">
                Phase 05 — Masterpiece Completed
              </span>
            </div>

            <h2
              className="text-display-md font-light text-[#F5F0E7] leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              “An Heirloom For <br />
              <span className="text-gold-gradient italic">Generations.</span>”
            </h2>

            <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-6 font-light">
              The finished creation stands assembled, motionless, and radiant on the right—ready to grace life&apos;s most momentous celebrations with eternal splendour.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/collections" className="btn-primary pointer-events-auto">
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/custom-design" className="btn-secondary pointer-events-auto">
                Inquire Bespoke Commission
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Clear Viewing Area reserved exclusively for the 3D Necklace */}
        <div className="hidden lg:block w-1/2 h-full pointer-events-none" />
      </section>

      {/* ========================================================================= */}
      {/* CRAFTSMANSHIP & DETAILED ARTISAN ANNOTATIONS */}
      {/* Flows smoothly below the pinned sequence with no competing scroll triggers */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen py-32 z-20 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Side: Editorial Narrative */}
        <div className="lg:w-1/2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9A45C] mb-4">
            <Compass className="w-4 h-4" />
            <span>Master Artisan Engineering</span>
          </div>

          <h2
            className="text-display-md font-light text-[#F5F0E7] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Designed with Intention. <br />
            <span className="text-[#C9A45C] italic">Finished by Hand.</span> <br />
            Made to Be Remembered.
          </h2>

          <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-8">
            True luxury does not shout; it radiates from microscopic accuracy. Every link is individually articulated to drape weightlessly, and each gemstone is seated in hand-burnished bezels designed to endure for centuries.
          </p>

          {/* Interactive Annotation Cards */}
          <div className="space-y-4">
            {[
              {
                id: 1,
                title: 'Hand-Assembled Interlocking Links',
                desc: 'Over eighty individual solid 22K gold curb links, calibrated with precision clearances for fluid movement across the clavicle.',
                icon: Gem,
              },
              {
                id: 2,
                title: 'Tiered Filigree Medallion & Beading',
                desc: 'Concentric hand-pierced gold petals with micro-beaded borders and round brilliant diamond accent settings.',
                icon: Sparkles,
              },
              {
                id: 3,
                title: 'Royal Sapphire & Articulated Teardrop',
                desc: 'A master-cut natural Royal Blue Sapphire framed in stepped gold bezels with a suspended teardrop pear drop.',
                icon: ShieldCheck,
              },
            ].map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveAnnotation(item.id)}
                onMouseLeave={() => setActiveAnnotation(null)}
                className={`p-5 border transition-all duration-300 cursor-pointer ${
                  activeAnnotation === item.id
                    ? 'border-[#C9A45C] bg-[#191713]/80 translate-x-2'
                    : 'border-[rgba(201,164,92,0.14)] bg-[#11100E]/60 hover:border-[#C9A45C]/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-4 h-4 text-[#C9A45C]" />
                  <h3
                    className="text-base text-[#F5F0E7] font-medium"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#A8A197] leading-relaxed pl-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Hallmark Standard Card */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 text-center border border-[rgba(201,164,92,0.15)] bg-[#11100E]/60 backdrop-blur-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] mb-2">
            Hallmark Standard
          </span>
          <h4
            className="text-2xl font-light text-[#F5F0E7] mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Damodar Insignia
          </h4>
          <p className="text-xs text-[#A8A197] max-w-sm mb-6 leading-relaxed">
            Every creation bears our subtle laser hallmark on the reverse of the central backplate—a silent pledge of purity, ethical provenance, and heirloom longevity.
          </p>
          <Link
            href="/about"
            className="text-xs text-[#C9A45C] hover:text-[#E9D5A0] tracking-widest uppercase flex items-center gap-1.5 transition-colors"
          >
            <span>Read Artisan Manifesto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HeroScrollExperience;
