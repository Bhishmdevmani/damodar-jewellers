'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles, RefreshCw } from 'lucide-react';
import {
  createDiamondRing,
  createGoldNecklace,
  createHeritageBangles,
  type JewelleryMaterialOptions,
} from './JewelleryModels';
import { createStudioEnvironment, setupLuxuryStudioLighting } from './StudioLighting';
import { isWebGLSupported } from '@/lib/utils';

export type JewelleryModelType = 'ring' | 'necklace' | 'bangles';

interface ProductViewer3DProps {
  modelType?: JewelleryModelType;
  title?: string;
  className?: string;
  showControls?: boolean;
}

export function ProductViewer3D({
  modelType = 'ring',
  title = 'Interactive 3D Masterpiece',
  className = '',
  showControls = true,
}: ProductViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFinish, setActiveFinish] = useState<NonNullable<JewelleryMaterialOptions['metalFinish']>>('yellow_gold');
  const [activeAngle, setActiveAngle] = useState<'front' | 'top' | 'angle' | 'macro'>('angle');
  const [isInteracting, setIsInteracting] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef({ x: 0.2, y: 0.5 });
  const targetDistanceRef = useRef(5.2);
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Check WebGL support on mount
  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      setIsLoading(false);
    }
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!hasWebGL || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent background to blend with dark obsidian
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, targetDistanceRef.current);
    cameraRef.current = camera;

    // 3. Renderer with high color fidelity
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment & Lighting
    const studioEnv = createStudioEnvironment(renderer);
    scene.environment = studioEnv.texture;
    setupLuxuryStudioLighting(scene);

    // 5. Add Floor Shadow Contact Plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Spawn Model
    loadModel(modelType, activeFinish);
    setIsLoading(false);

    // 7. Animation Loop with smooth inertial damping
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (modelGroupRef.current) {
        // Auto slow turntable rotation when user is not actively dragging
        if (!isDraggingRef.current) {
          targetRotationRef.current.y += delta * 0.25;
        }

        // Smooth Lerp Rotation
        modelGroupRef.current.rotation.x += (targetRotationRef.current.x - modelGroupRef.current.rotation.x) * 0.08;
        modelGroupRef.current.rotation.y += (targetRotationRef.current.y - modelGroupRef.current.rotation.y) * 0.08;

        // Subtle floating breathing effect
        const floatY = Math.sin(clock.getElapsedTime() * 1.5) * 0.06;
        modelGroupRef.current.position.y = floatY;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z += (targetDistanceRef.current - cameraRef.current.position.z) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      studioEnv.dispose();
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [hasWebGL, modelType]);

  // Load Model Helper
  const loadModel = (type: JewelleryModelType, finish: JewelleryMaterialOptions['metalFinish']) => {
    if (!sceneRef.current) return;

    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
    }

    let model: THREE.Group;
    if (type === 'ring') {
      model = createDiamondRing(finish);
      model.scale.set(1.1, 1.1, 1.1);
      model.position.y = -0.5;
    } else if (type === 'necklace') {
      model = createGoldNecklace(finish);
      model.scale.set(1.1, 1.1, 1.1);
      model.position.y = -0.3;
    } else {
      model = createHeritageBangles(finish);
      model.scale.set(1.0, 1.0, 1.0);
    }

    modelGroupRef.current = model;
    sceneRef.current.add(model);
  };

  // Switch Metal Finish
  const handleFinishChange = (finish: NonNullable<JewelleryMaterialOptions['metalFinish']>) => {
    setActiveFinish(finish);
    loadModel(modelType, finish);
  };

  // Switch Viewing Angle
  const setCameraAngle = (angle: 'front' | 'top' | 'angle' | 'macro') => {
    setActiveAngle(angle);
    if (angle === 'front') {
      targetRotationRef.current = { x: 0, y: 0 };
      targetDistanceRef.current = 5.2;
    } else if (angle === 'top') {
      targetRotationRef.current = { x: 1.35, y: 0 };
      targetDistanceRef.current = 4.8;
    } else if (angle === 'angle') {
      targetRotationRef.current = { x: 0.35, y: 0.75 };
      targetDistanceRef.current = 5.2;
    } else if (angle === 'macro') {
      targetRotationRef.current = { x: 0.25, y: 0.4 };
      targetDistanceRef.current = 3.4; // Close-up macro view
    }
  };

  // Pointer Interaction Handlers for smooth orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerRef.current.x;
    const deltaY = e.clientY - previousPointerRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    // Clamp vertical tilt
    targetRotationRef.current.x = Math.max(-1.2, Math.min(1.4, targetRotationRef.current.x));

    previousPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    setIsInteracting(false);
    if (containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch { /* ignore */ }
    }
  };

  // Zoom Helpers
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      targetDistanceRef.current = Math.max(2.8, targetDistanceRef.current - 0.7);
    } else {
      targetDistanceRef.current = Math.min(7.5, targetDistanceRef.current + 0.7);
    }
  };

  return (
    <div className={`relative flex flex-col bg-gradient-to-b from-[#14120E] to-[#0A0907] border border-[rgba(201,164,92,0.18)] rounded-[2px] overflow-hidden select-none ${className}`}>
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,164,92,0.12)] bg-[#11100E]/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A45C]" />
          <span className="text-xs uppercase tracking-[0.15em] text-[#E9D5A0] font-medium">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#A8A197]">
          <RotateCw className="w-3.5 h-3.5 text-[#C9A45C] animate-spin-slow" />
          <span>Drag to orbit</span>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[400px] sm:h-[480px] lg:h-[540px] cursor-grab ${
          isInteracting ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080807]/90 z-20">
            <div className="w-10 h-10 border-2 border-[#C9A45C]/30 border-t-[#C9A45C] rounded-full animate-spin mb-3" />
            <span className="text-xs text-[#A8A197] tracking-widest uppercase">
              Rendering Precious Metals...
            </span>
          </div>
        )}

        {/* Graceful Fallback if WebGL is unavailable */}
        {!hasWebGL && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#11100E]">
            <div className="w-24 h-24 rounded-full border border-[#C9A45C]/40 flex items-center justify-center bg-[#C9A45C]/5 mb-4">
              <span className="text-3xl text-[#C9A45C]">✦</span>
            </div>
            <h4 className="text-lg font-light text-[#F5F0E7] mb-2 font-serif">
              Masterpiece Jewellery Preview
            </h4>
            <p className="text-xs text-[#A8A197] max-w-sm mb-4">
              WebGL acceleration is inactive on this device. Explore high-resolution photography in our collection catalog.
            </p>
          </div>
        )}

        {/* Floating Zoom & Reset Toolbar */}
        {showControls && hasWebGL && (
          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => handleZoom('in')}
              aria-label="Zoom in"
              className="w-8 h-8 rounded-full bg-[#191713]/80 border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#F5F0E7] hover:border-[#C9A45C] flex items-center justify-center transition-all backdrop-blur-md"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              aria-label="Zoom out"
              className="w-8 h-8 rounded-full bg-[#191713]/80 border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#F5F0E7] hover:border-[#C9A45C] flex items-center justify-center transition-all backdrop-blur-md"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraAngle('angle')}
              aria-label="Reset view"
              className="w-8 h-8 rounded-full bg-[#191713]/80 border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#F5F0E7] hover:border-[#C9A45C] flex items-center justify-center transition-all backdrop-blur-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Customization Bar */}
      {showControls && hasWebGL && (
        <div className="p-4 sm:p-5 border-t border-[rgba(201,164,92,0.14)] bg-[#11100E] z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Metal Finish Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#A8A197]">
              Precious Finish:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFinishChange('yellow_gold')}
                className={`px-3 py-1.5 text-xs border transition-all flex items-center gap-1.5 ${
                  activeFinish === 'yellow_gold'
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#E9D5A0]'
                    : 'border-white/10 text-[#A8A197] hover:border-white/20'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] inline-block shadow-sm" />
                22K Gold
              </button>
              <button
                onClick={() => handleFinishChange('rose_gold')}
                className={`px-3 py-1.5 text-xs border transition-all flex items-center gap-1.5 ${
                  activeFinish === 'rose_gold'
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#E9D5A0]'
                    : 'border-white/10 text-[#A8A197] hover:border-white/20'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#E0A389] inline-block shadow-sm" />
                Rose Gold
              </button>
              <button
                onClick={() => handleFinishChange('white_gold')}
                className={`px-3 py-1.5 text-xs border transition-all flex items-center gap-1.5 ${
                  activeFinish === 'white_gold'
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#E9D5A0]'
                    : 'border-white/10 text-[#A8A197] hover:border-white/20'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8ECF0] inline-block shadow-sm" />
                Platinum
              </button>
            </div>
          </div>

          {/* Camera Angles */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] uppercase tracking-widest text-[#A8A197]">
              Perspective:
            </span>
            {(['angle', 'front', 'top', 'macro'] as const).map((angle) => (
              <button
                key={angle}
                onClick={() => setCameraAngle(angle)}
                className={`text-xs px-2.5 py-1 uppercase tracking-wider border transition-all ${
                  activeAngle === angle
                    ? 'border-[#C9A45C] text-[#E9D5A0] bg-[#C9A45C]/10'
                    : 'border-white/5 text-[#A8A197] hover:border-white/15'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
