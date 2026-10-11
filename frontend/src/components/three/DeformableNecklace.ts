import * as THREE from 'three';
import { getGoldMaterial, getDiamondMaterial, getGemstoneMaterial, type JewelleryMaterialOptions } from './JewelleryModels';

export interface ExplodedPendantComponents {
  root: THREE.Group;
  bail: THREE.Mesh;
  backplate: THREE.Mesh;
  outerMedallion: THREE.Mesh;
  outerBeads: THREE.InstancedMesh;
  petalGallery: THREE.Group;
  bezelCollar: THREE.Mesh;
  gemstone: THREE.Mesh;
  innerHalo: THREE.InstancedMesh;
  teardropAssembly: THREE.Group;
}

export interface DeformableNecklaceController {
  group: THREE.Group;
  surfaceMesh: THREE.Mesh;
  updateScrollProgress: (progress: number, aspect?: number) => void;
  setExplodedState: (explodeFactor: number, aspect?: number) => void;
  pendant: ExplodedPendantComponents;
  dispose: () => void;
}

/**
 * Creates an authentic luxury Indian 22K gold necklace with an articulated
 * curb link chain and an 8-tier exploded central pendant assembly.
 *
 * Engineered with precise geometric centering so rotations and transformations
 * pivot stably around the necklace's center with zero clipping or drift.
 */
export function createDeformableNecklace(
  finish: JewelleryMaterialOptions['metalFinish'] = 'yellow_gold'
): DeformableNecklaceController {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'LuxuryGoldNecklace';

  const goldMat = getGoldMaterial(finish);
  const diamondMat = getDiamondMaterial();
  const sapphireMat = getGemstoneMaterial('sapphire');

  // ─── 1. Articulated Chain Links Architecture ───────────────────────────────
  const LINK_COUNT = 84;

  // Precision-sculpted gold curb link with soft bevels
  const linkGeo = new THREE.TorusGeometry(0.065, 0.022, 14, 28);
  linkGeo.scale(1.3, 0.75, 1.0); // Elongated oval curb link

  const instancedLinks = new THREE.InstancedMesh(linkGeo, goldMat, LINK_COUNT);
  instancedLinks.castShadow = true;
  instancedLinks.receiveShadow = true;
  rootGroup.add(instancedLinks);

  // Secondary continuous fine inner gold cord to give visual weight beneath links
  const cordSegments = 120;
  const cordPositions = new Float32Array((cordSegments + 1) * 3);
  const cordGeo = new THREE.BufferGeometry();
  cordGeo.setAttribute('position', new THREE.BufferAttribute(cordPositions, 3));
  const cordMat = new THREE.LineBasicMaterial({
    color: finish === 'rose_gold' ? 0xE49F86 : finish === 'white_gold' ? 0xE8EDF2 : 0xCFA244,
    linewidth: 2,
    transparent: true,
    opacity: 0.65,
  });
  const cordLine = new THREE.Line(cordGeo, cordMat);
  rootGroup.add(cordLine);

  // ─── 2. Multi-Layer Exploded Pendant Architecture ──────────────────────────
  const pendantRoot = new THREE.Group();
  pendantRoot.name = 'PendantRoot';

  // ── Tier 1: Suspension Bail & Articulated Jump Ring (moves up +Y in exploded view)
  const bailGeo = new THREE.TorusGeometry(0.12, 0.03, 14, 20);
  const bailMesh = new THREE.Mesh(bailGeo, goldMat);
  bailMesh.name = 'Bail';
  bailMesh.position.set(0, 0.14, 0);
  bailMesh.castShadow = true;
  pendantRoot.add(bailMesh);

  // ── Tier 2: Structural Gold Backplate with Openwork Jaali (moves -Z in exploded view)
  const backplateGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.04, 32);
  backplateGeo.rotateX(Math.PI / 2);
  const backplateMesh = new THREE.Mesh(backplateGeo, goldMat);
  backplateMesh.name = 'Backplate';
  backplateMesh.position.set(0, -0.40, -0.04);
  backplateMesh.castShadow = true;
  pendantRoot.add(backplateMesh);

  // ── Tier 3: Medallion Rim with Granulation Beading (Mid-plane Z = 0)
  const outerMedallionGeo = new THREE.TorusGeometry(0.60, 0.055, 16, 36);
  const outerMedallionMesh = new THREE.Mesh(outerMedallionGeo, goldMat);
  outerMedallionMesh.name = 'OuterMedallion';
  outerMedallionMesh.position.set(0, -0.40, 0);
  outerMedallionMesh.castShadow = true;
  pendantRoot.add(outerMedallionMesh);

  // Micro-beading along the medallion rim
  const beadCount = 32;
  const beadGeo = new THREE.SphereGeometry(0.026, 8, 8);
  const outerBeadsMesh = new THREE.InstancedMesh(beadGeo, goldMat, beadCount);
  outerBeadsMesh.name = 'GranulationBeads';
  outerBeadsMesh.position.set(0, -0.40, 0);
  const dummyMatrix = new THREE.Matrix4();
  for (let b = 0; b < beadCount; b++) {
    const angle = (b / beadCount) * Math.PI * 2;
    dummyMatrix.makeTranslation(Math.cos(angle) * 0.66, Math.sin(angle) * 0.66, 0);
    outerBeadsMesh.setMatrixAt(b, dummyMatrix);
  }
  outerBeadsMesh.instanceMatrix.needsUpdate = true;
  outerBeadsMesh.castShadow = true;
  pendantRoot.add(outerBeadsMesh);

  // ── Tier 4: Kundan / 8-Petal Sculpted Gold Gallery & Diamonds (moves +Z in exploded view)
  const petalGalleryGroup = new THREE.Group();
  petalGalleryGroup.name = 'PetalGallery';
  petalGalleryGroup.position.set(0, -0.40, 0);
  const petalCount = 8;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;

    // Sculpted gold petal loop
    const petalGeo = new THREE.TorusGeometry(0.24, 0.025, 10, 20);
    const petal = new THREE.Mesh(petalGeo, goldMat);
    petal.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0.02);
    petal.rotation.z = angle;
    petal.castShadow = true;
    petalGalleryGroup.add(petal);

    // Brilliant-cut solitaire accent at the petal tip
    const diaGeo = new THREE.SphereGeometry(0.042, 8, 8);
    const diamondAccent = new THREE.Mesh(diaGeo, diamondMat);
    diamondAccent.position.set(Math.cos(angle) * 0.58, Math.sin(angle) * 0.58, 0.05);
    petalGalleryGroup.add(diamondAccent);
  }
  pendantRoot.add(petalGalleryGroup);

  // ── Tier 5: Stepped Center Bezel Collar (moves further +Z in exploded view)
  const bezelCollarGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.10, 32);
  bezelCollarGeo.rotateX(Math.PI / 2);
  const bezelCollarMesh = new THREE.Mesh(bezelCollarGeo, goldMat);
  bezelCollarMesh.name = 'BezelCollar';
  bezelCollarMesh.position.set(0, -0.40, 0.04);
  bezelCollarMesh.castShadow = true;
  pendantRoot.add(bezelCollarMesh);

  // ── Tier 6: Natural Royal Blue Sapphire Centerpiece (moves foremost +Z in exploded view)
  const gemstoneGeo = new THREE.SphereGeometry(0.28, 28, 28);
  gemstoneGeo.scale(1.0, 1.0, 0.42); // Faceted cabochon crown
  const gemstoneMesh = new THREE.Mesh(gemstoneGeo, sapphireMat);
  gemstoneMesh.name = 'CenterSapphire';
  gemstoneMesh.position.set(0, -0.40, 0.08);
  gemstoneMesh.castShadow = true;
  pendantRoot.add(gemstoneMesh);

  // ── Tier 7: Inner Diamond Halo Accent Ring (moves +Z with the gem)
  const innerHaloCount = 16;
  const haloDiaGeo = new THREE.SphereGeometry(0.028, 8, 8);
  const innerHaloMesh = new THREE.InstancedMesh(haloDiaGeo, diamondMat, innerHaloCount);
  innerHaloMesh.name = 'InnerDiamondHalo';
  innerHaloMesh.position.set(0, -0.40, 0.07);
  for (let h = 0; h < innerHaloCount; h++) {
    const angle = (h / innerHaloCount) * Math.PI * 2;
    dummyMatrix.makeTranslation(Math.cos(angle) * 0.36, Math.sin(angle) * 0.36, 0.02);
    innerHaloMesh.setMatrixAt(h, dummyMatrix);
  }
  innerHaloMesh.instanceMatrix.needsUpdate = true;
  pendantRoot.add(innerHaloMesh);

  // ── Tier 8: Articulated Teardrop / Pear Drop Assembly (moves -Y downward in exploded view)
  const teardropAssembly = new THREE.Group();
  teardropAssembly.name = 'TeardropAssembly';
  teardropAssembly.position.set(0, -0.84, 0);

  const dropLoopGeo = new THREE.TorusGeometry(0.07, 0.018, 10, 16);
  const dropLoop = new THREE.Mesh(dropLoopGeo, goldMat);
  dropLoop.position.set(0, 0.10, 0);
  dropLoop.castShadow = true;
  teardropAssembly.add(dropLoop);

  const dropBezelGeo = new THREE.ConeGeometry(0.18, 0.48, 20);
  dropBezelGeo.rotateZ(Math.PI);
  const dropGem = new THREE.Mesh(dropBezelGeo, sapphireMat);
  dropGem.position.set(0, -0.10, 0);
  dropGem.castShadow = true;
  teardropAssembly.add(dropGem);

  const dropCapGeo = new THREE.SphereGeometry(0.19, 14, 14);
  dropCapGeo.scale(1.0, 0.6, 1.0);
  const dropCap = new THREE.Mesh(dropCapGeo, goldMat);
  dropCap.position.set(0, 0.04, 0);
  dropCap.castShadow = true;
  teardropAssembly.add(dropCap);

  // Gold seed terminal bead
  const seedGeo = new THREE.SphereGeometry(0.05, 10, 10);
  const seedMesh = new THREE.Mesh(seedGeo, goldMat);
  seedMesh.position.set(0, -0.38, 0);
  seedMesh.castShadow = true;
  teardropAssembly.add(seedMesh);

  pendantRoot.add(teardropAssembly);
  rootGroup.add(pendantRoot);

  // ─── 3. Phase 1 Velvet Presentation Tray ──────────────────────────────────
  // A dark obsidian velvet presentation cushion for Phase 1 resting horizontal view
  const surfaceGeo = new THREE.CylinderGeometry(1.9, 1.95, 0.04, 48);
  const surfaceMat = new THREE.MeshStandardMaterial({
    color: 0x100E0C,
    roughness: 0.88,
    metalness: 0.12,
    transparent: true,
    opacity: 1.0,
  });
  const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
  surfaceMesh.name = 'VelvetPresentationTray';
  surfaceMesh.receiveShadow = true;

  const rimGeo = new THREE.TorusGeometry(1.92, 0.022, 12, 48);
  const rimMat = new THREE.MeshPhysicalMaterial({
    color: 0xC9A45C,
    metalness: 0.85,
    roughness: 0.25,
    transparent: true,
    opacity: 0.85,
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.02;
  surfaceMesh.add(rimMesh);

  const pendantComponents: ExplodedPendantComponents = {
    root: pendantRoot,
    bail: bailMesh,
    backplate: backplateMesh,
    outerMedallion: outerMedallionMesh,
    outerBeads: outerBeadsMesh,
    petalGallery: petalGalleryGroup,
    bezelCollar: bezelCollarMesh,
    gemstone: gemstoneMesh,
    innerHalo: innerHaloMesh,
    teardropAssembly,
  };

  // ─── 4. Mathematical Chain Curve & Expansion Engine ────────────────────────
  // Symmetrically centered around Y = 0 with bounded width and height:
  // Compact state: width ~ 2.30, height ~ 2.72 (Y in [-1.37, 1.35]), Z in [-0.45, 0]
  // Exploded state: width ~ 3.10, height ~ 3.25, Z in [-0.20, 0.25]
  const getCurvePoint = (s: number, expansion: number, aspect: number, out: THREE.Vector3): THREE.Vector3 => {
    // Map s from [0, 1] to centered t in [-1, 1]
    const t = s * 2 - 1;
    const absT = Math.abs(t);

    const aspectCorrection = aspect < 1.0 ? Math.max(0.70, aspect * 0.95) : 1.0;

    // Width: compact resting 1.15 -> exploded 1.42
    const width = THREE.MathUtils.lerp(1.15, 1.42, expansion) * aspectCorrection;
    const shoulderSpread = THREE.MathUtils.lerp(0.0, 0.15, expansion);
    const x = t * width * (1 + absT * shoulderSpread);

    // Y: compact nadir at -0.15, upper clasp ends at +1.35
    // exploded nadir at +0.02, upper clasp ends at +1.48
    const nadirY = THREE.MathUtils.lerp(-0.15, 0.02, expansion);
    const upperY = THREE.MathUtils.lerp(1.35, 1.48, expansion);
    const yProfile = Math.pow(absT, 1.75);
    const y = nadirY + (upperY - nadirY) * yProfile;

    // Z: depth drape
    const nadirZ = THREE.MathUtils.lerp(0.0, 0.20, expansion);
    const upperZ = THREE.MathUtils.lerp(-0.45, -0.20, expansion);
    const z = nadirZ + (upperZ - nadirZ) * Math.pow(absT, 1.5);

    out.set(x, y, z);
    return out;
  };

  // Reusable vectors for Frenet-Serret link orientation
  const ptA = new THREE.Vector3();
  const ptB = new THREE.Vector3();
  const ptC = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const linkPos = new THREE.Vector3();
  const rotationMatrix = new THREE.Matrix4();
  const linkMatrix = new THREE.Matrix4();
  const upRef = new THREE.Vector3(0, 0, 1);

  // ─── 5. Direct Exploded State Transformer ──────────────────────────────────
  const setExplodedState = (explodeFactor: number, aspect: number = 1.6) => {
    const factor = THREE.MathUtils.clamp(explodeFactor, 0, 1);

    // A. Update Instanced Chain Links along dynamic curve
    for (let i = 0; i < LINK_COUNT; i++) {
      const s = i / (LINK_COUNT - 1);
      getCurvePoint(s, factor, aspect, linkPos);

      // Central differences tangent calculation
      const deltaS = 0.005;
      const sPrev = Math.max(0, s - deltaS);
      const sNext = Math.min(1, s + deltaS);
      getCurvePoint(sPrev, factor, aspect, ptA);
      getCurvePoint(sNext, factor, aspect, ptB);
      tangent.subVectors(ptB, ptA).normalize();

      // Stable normal = tangent x upRef
      normal.crossVectors(tangent, upRef).normalize();
      if (normal.lengthSq() < 0.01) {
        normal.set(1, 0, 0);
      }
      binormal.crossVectors(tangent, normal).normalize();

      // Alternate link rotation by 90 degrees around tangent axis for interlocking curb chain
      const isAlternating = i % 2 === 1;
      const rollAngle = isAlternating ? Math.PI / 2 : 0;

      rotationMatrix.makeBasis(tangent, normal, binormal);
      if (rollAngle !== 0) {
        const rollMatrix = new THREE.Matrix4().makeRotationAxis(tangent, rollAngle);
        rotationMatrix.premultiply(rollMatrix);
      }

      linkMatrix.makeTranslation(linkPos.x, linkPos.y, linkPos.z);
      linkMatrix.multiply(rotationMatrix);

      instancedLinks.setMatrixAt(i, linkMatrix);
    }
    instancedLinks.instanceMatrix.needsUpdate = true;

    // B. Update Fine Inner Cord Line
    const posAttr = cordGeo.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    for (let j = 0; j <= cordSegments; j++) {
      const s = j / cordSegments;
      getCurvePoint(s, factor, aspect, ptC);
      posArray[j * 3] = ptC.x;
      posArray[j * 3 + 1] = ptC.y;
      posArray[j * 3 + 2] = ptC.z;
    }
    posAttr.needsUpdate = true;

    // C. Update Pendant Root Attachment Point at Nadir (s = 0.5)
    getCurvePoint(0.5, factor, aspect, ptC);
    pendantRoot.position.set(ptC.x, ptC.y, ptC.z);
    pendantRoot.rotation.z = 0;

    // D. Explode Individual Pendant Component Tiers along dedicated 3D paths
    // 1. Bail lifts upward along +Y
    bailMesh.position.set(0, 0.14 + factor * 0.38, 0);

    // 2. Jaali Backplate moves backward along -Z
    backplateMesh.position.set(0, -0.40, -0.04 - factor * 0.44);

    // 3. Medallion Rim & Outer Granulation Beads remain steady at mid-plane Z = 0
    outerMedallionMesh.position.set(0, -0.40, 0);
    outerBeadsMesh.position.set(0, -0.40, 0);

    // 4. Kundan 8-Petal Gallery & Diamond Accents separate forward along +Z
    petalGalleryGroup.position.set(0, -0.40, factor * 0.30);

    // 5. Stepped Bezel Collar moves forward along +Z
    bezelCollarMesh.position.set(0, -0.40, 0.04 + factor * 0.58);

    // 6. Natural Royal Blue Center Sapphire moves foremost along +Z
    gemstoneMesh.position.set(0, -0.40, 0.08 + factor * 0.90);

    // 7. Inner Diamond Halo Ring moves forward along +Z with gemstone
    innerHaloMesh.position.set(0, -0.40, 0.07 + factor * 0.74);

    // 8. Articulated Teardrop Pear Assembly drops downward along -Y
    teardropAssembly.position.set(0, -0.84 - factor * 0.46, 0);
  };

  // ─── 6. Master Scroll Progress Synchronizer ────────────────────────────────
  // Map normalized scroll progress p in [0, 1] into the 5 phases:
  // Phase 1 (p = 0): Resting horizontal (explodeFactor = 0)
  // Phase 2 (0 < p <= 0.30): Upright lifting (explodeFactor = 0)
  // Phase 3 (0.30 < p <= 0.70): Exploded component animation (peaks at 0.54, holds until 0.70)
  // Phase 4 (0.70 < p <= 0.94): Smooth reassembly back to 0
  // Phase 5 (p > 0.94): Permanent final hold at 0 (fully assembled, motionless)
  const updateScrollProgress = (progress: number, aspect: number = 1.6) => {
    const p = THREE.MathUtils.clamp(progress, 0, 1);

    let factor = 0;
    if (p <= 0.30) {
      factor = 0;
    } else if (p <= 0.54) {
      factor = THREE.MathUtils.smoothstep(p, 0.30, 0.54);
    } else if (p <= 0.70) {
      factor = 1.0; // Deliberate plateau hold at maximum expansion
    } else if (p <= 0.94) {
      factor = 1.0 - THREE.MathUtils.smoothstep(p, 0.70, 0.94);
    } else {
      factor = 0;
    }

    setExplodedState(factor, aspect);
  };

  // Initial update: 100% assembled
  setExplodedState(0, 1.6);

  // ─── 7. Memory Disposal ────────────────────────────────────────────────────
  const dispose = () => {
    linkGeo.dispose();
    cordGeo.dispose();
    cordMat.dispose();
    bailGeo.dispose();
    backplateGeo.dispose();
    outerMedallionGeo.dispose();
    beadGeo.dispose();
    bezelCollarGeo.dispose();
    gemstoneGeo.dispose();
    haloDiaGeo.dispose();
    dropLoopGeo.dispose();
    dropBezelGeo.dispose();
    dropCapGeo.dispose();
    seedGeo.dispose();
    surfaceGeo.dispose();
    surfaceMat.dispose();
    rimGeo.dispose();
    rimMat.dispose();
  };

  return {
    group: rootGroup,
    surfaceMesh,
    updateScrollProgress,
    setExplodedState,
    pendant: pendantComponents,
    dispose,
  };
}
