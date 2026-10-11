import * as THREE from 'three';

export interface JewelleryMaterialOptions {
  metalFinish?: 'yellow_gold' | 'rose_gold' | 'white_gold';
}

/**
 * Get luxury metallic material based on selected finish
 */
export function getGoldMaterial(finish: JewelleryMaterialOptions['metalFinish'] = 'yellow_gold'): THREE.MeshPhysicalMaterial {
  const colors = {
    yellow_gold: 0xF4CB58, // Warm 22K Indian Gold Bullion
    rose_gold: 0xE49F86,   // Royal Rose Gold
    white_gold: 0xE8EDF2,  // Platinum / White Gold
  };

  return new THREE.MeshPhysicalMaterial({
    color: colors[finish] || colors.yellow_gold,
    metalness: 0.90, // Calibrated so shadows stay warm golden amber
    roughness: 0.17, // Smooth hand-polished lustre
    reflectivity: 0.98,
    clearcoat: 0.45,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.6,
  });
}

/**
 * Get diamond material with high refraction and brilliance
 */
export function getDiamondMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.02,
    roughness: 0.01,
    transmission: 0.94,
    ior: 2.417, // Diamond refractive index
    transparent: true,
    opacity: 0.96,
    reflectivity: 1.0,
    specularIntensity: 1.0,
    specularColor: new THREE.Color(0xffffff),
    envMapIntensity: 2.4,
  });
}

/**
 * Get gemstone material (e.g. sapphire, ruby, emerald)
 */
export function getGemstoneMaterial(type: 'sapphire' | 'ruby' | 'emerald'): THREE.MeshPhysicalMaterial {
  const colors = {
    sapphire: 0x0c3872, // Royal Blue Sapphire
    ruby: 0x9b0429,     // Pigeon Blood Ruby
    emerald: 0x085c2c,  // Colombian Emerald
  };

  return new THREE.MeshPhysicalMaterial({
    color: colors[type],
    metalness: 0.08,
    roughness: 0.03,
    transmission: 0.88,
    ior: 1.77, // Corundum refractive index
    transparent: true,
    opacity: 0.94,
    clearcoat: 0.95,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
    envMapIntensity: 2.0,
  });
}

/**
 * Creates a masterwork Diamond Solitaire Ring with 6-prong crown and pavé shoulders
 */
export function createDiamondRing(finish: JewelleryMaterialOptions['metalFinish'] = 'yellow_gold'): THREE.Group {
  const group = new THREE.Group();
  group.name = 'DiamondRing';

  const goldMat = getGoldMaterial(finish);
  const diamondMat = getDiamondMaterial();

  // 1. Main Band (Torus with comfortable inner curve)
  const bandGeo = new THREE.TorusGeometry(1.6, 0.22, 32, 100);
  const band = new THREE.Mesh(bandGeo, goldMat);
  band.castShadow = true;
  band.receiveShadow = true;
  group.add(band);

  // 2. Head / Crown Base
  const crownBaseGeo = new THREE.CylinderGeometry(0.55, 0.35, 0.4, 24);
  const crownBase = new THREE.Mesh(crownBaseGeo, goldMat);
  crownBase.position.y = 1.65;
  group.add(crownBase);

  // 3. Six Prongs holding the diamond
  const prongCount = 6;
  const prongRadius = 0.52;
  for (let i = 0; i < prongCount; i++) {
    const angle = (i / prongCount) * Math.PI * 2;
    const px = Math.cos(angle) * prongRadius;
    const pz = Math.sin(angle) * prongRadius;

    const prongGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.75, 12);
    const prong = new THREE.Mesh(prongGeo, goldMat);
    prong.position.set(px, 1.95, pz);
    prong.rotation.x = (pz / prongRadius) * -0.15;
    prong.rotation.z = (px / prongRadius) * 0.15;
    group.add(prong);

    // Claw tip holding stone
    const clawGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const claw = new THREE.Mesh(clawGeo, goldMat);
    claw.position.set(px * 0.92, 2.32, pz * 0.92);
    group.add(claw);
  }

  // 4. Brilliant Cut Center Diamond
  const diamondGroup = new THREE.Group();
  
  // Crown (top facets)
  const crownGeo = new THREE.ConeGeometry(0.55, 0.35, 16);
  crownGeo.rotateX(Math.PI);
  const diamondCrown = new THREE.Mesh(crownGeo, diamondMat);
  diamondCrown.position.y = 2.15;
  diamondGroup.add(diamondCrown);

  // Table (flat top)
  const tableGeo = new THREE.CylinderGeometry(0.35, 0.55, 0.15, 16);
  const diamondTable = new THREE.Mesh(tableGeo, diamondMat);
  diamondTable.position.y = 2.3;
  diamondGroup.add(diamondTable);

  // Pavilion (bottom point)
  const pavilionGeo = new THREE.ConeGeometry(0.55, 0.6, 16);
  const diamondPavilion = new THREE.Mesh(pavilionGeo, diamondMat);
  diamondPavilion.position.y = 1.85;
  diamondGroup.add(diamondPavilion);

  diamondGroup.scale.set(1.1, 1.1, 1.1);
  group.add(diamondGroup);

  // 5. Pavé diamonds on the ring shoulders
  const shoulderStoneGeo = new THREE.SphereGeometry(0.065, 10, 10);
  for (let s = -1; s <= 1; s += 2) {
    for (let i = 1; i <= 6; i++) {
      const angle = (Math.PI / 2) + (s * i * 0.1);
      const sx = Math.cos(angle) * 1.6;
      const sy = Math.sin(angle) * 1.6;
      const stone = new THREE.Mesh(shoulderStoneGeo, diamondMat);
      stone.position.set(sx, sy, 0);
      group.add(stone);
    }
  }

  return group;
}

/**
 * Creates an exquisite Gold & Gemstone Pendant Necklace
 */
export function createGoldNecklace(finish: JewelleryMaterialOptions['metalFinish'] = 'yellow_gold'): THREE.Group {
  const group = new THREE.Group();
  group.name = 'GoldNecklace';

  const goldMat = getGoldMaterial(finish);
  const diamondMat = getDiamondMaterial();
  const sapphireMat = getGemstoneMaterial('sapphire');

  // 1. Curved chain curve
  const points: THREE.Vector3[] = [];
  const segments = 60;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 - 1; // -1 to 1
    const x = t * 2.4;
    const y = Math.cos(t * Math.PI * 0.5) * -1.8 + 1.8;
    const z = Math.sin(t * Math.PI) * 0.25;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const chainGeo = new THREE.TubeGeometry(curve, 100, 0.045, 10, false);
  const chain = new THREE.Mesh(chainGeo, goldMat);
  group.add(chain);

  // 2. Central Ornate Pendant
  const pendantGroup = new THREE.Group();
  pendantGroup.position.set(0, 0, 0);

  // Bail (connection loop)
  const bailGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 24);
  const bail = new THREE.Mesh(bailGeo, goldMat);
  bail.position.set(0, 0.1, 0);
  pendantGroup.add(bail);

  // Outer Filigree Medallion
  const outerRingGeo = new THREE.TorusGeometry(0.85, 0.08, 20, 48);
  const outerRing = new THREE.Mesh(outerRingGeo, goldMat);
  pendantGroup.add(outerRing);

  // Inner Ornate Star / Flower
  const petals = 8;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    const petalGeo = new THREE.TorusGeometry(0.35, 0.035, 12, 24);
    const petal = new THREE.Mesh(petalGeo, goldMat);
    petal.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0);
    pendantGroup.add(petal);

    // Accent diamonds on petals
    const accentStoneGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const accentStone = new THREE.Mesh(accentStoneGeo, diamondMat);
    accentStone.position.set(Math.cos(angle) * 0.85, Math.sin(angle) * 0.85, 0.04);
    pendantGroup.add(accentStone);
  }

  // Central Bezel Setting with Royal Blue Sapphire
  const centerBezelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 32);
  centerBezelGeo.rotateX(Math.PI / 2);
  const centerBezel = new THREE.Mesh(centerBezelGeo, goldMat);
  pendantGroup.add(centerBezel);

  const centerGemGeo = new THREE.SphereGeometry(0.32, 24, 24);
  centerGemGeo.scale(1, 1, 0.45);
  const centerGem = new THREE.Mesh(centerGemGeo, sapphireMat);
  centerGem.position.z = 0.05;
  pendantGroup.add(centerGem);

  // Teardrop pendant drop
  const dropGeo = new THREE.ConeGeometry(0.2, 0.55, 16);
  dropGeo.rotateZ(Math.PI);
  const dropGem = new THREE.Mesh(dropGeo, sapphireMat);
  dropGem.position.set(0, -1.2, 0);
  pendantGroup.add(dropGem);

  group.add(pendantGroup);

  return group;
}

/**
 * Creates a pair of Royal Heritage Gold Bangles
 */
export function createHeritageBangles(finish: JewelleryMaterialOptions['metalFinish'] = 'yellow_gold'): THREE.Group {
  const group = new THREE.Group();
  group.name = 'HeritageBangles';

  const goldMat = getGoldMaterial(finish);
  const rubyMat = getGemstoneMaterial('ruby');
  const emeraldMat = getGemstoneMaterial('emerald');

  const bangleConfigs = [-0.35, 0.35];

  bangleConfigs.forEach((zOffset, bIndex) => {
    const bangleGroup = new THREE.Group();
    bangleGroup.position.z = zOffset;

    // Main Band
    const mainBandGeo = new THREE.TorusGeometry(1.5, 0.18, 30, 80);
    const mainBand = new THREE.Mesh(mainBandGeo, goldMat);
    bangleGroup.add(mainBand);

    // Carved beaded edges
    const edgeBeadCount = 48;
    for (let i = 0; i < edgeBeadCount; i++) {
      const angle = (i / edgeBeadCount) * Math.PI * 2;
      const bx = Math.cos(angle) * 1.5;
      const by = Math.sin(angle) * 1.5;

      const beadGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const topBead = new THREE.Mesh(beadGeo, goldMat);
      topBead.position.set(bx, by, 0.16);
      bangleGroup.add(topBead);

      const bottomBead = new THREE.Mesh(beadGeo, goldMat);
      bottomBead.position.set(bx, by, -0.16);
      bangleGroup.add(bottomBead);
    }

    // Gemstone studs (alternating ruby and emerald)
    const gemCount = 12;
    for (let i = 0; i < gemCount; i++) {
      const angle = (i / gemCount) * Math.PI * 2;
      const gx = Math.cos(angle) * 1.5;
      const gy = Math.sin(angle) * 1.5;

      const gemMat = (i + bIndex) % 2 === 0 ? rubyMat : emeraldMat;
      const gemGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(gx, gy, 0.12);
      bangleGroup.add(gem);
    }

    group.add(bangleGroup);
  });

  return group;
}

/**
 * Creates luxury studio lighting for jewellery with reflections
 */
export function setupJewelleryLighting(scene: THREE.Scene): {
  keyLight: THREE.SpotLight;
  fillLight: THREE.PointLight;
  rimLight: THREE.DirectionalLight;
} {
  // Ambient light for soft gold base illumination
  const ambient = new THREE.AmbientLight(0xfffaed, 1.2);
  scene.add(ambient);

  // Warm key spot light focusing on brilliance
  const keyLight = new THREE.SpotLight(0xfff3db, 6.5);
  keyLight.position.set(4, 5, 4);
  keyLight.angle = Math.PI / 4;
  keyLight.penumbra = 0.6;
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Cool fill light to create depth and contrast on metal edges
  const fillLight = new THREE.PointLight(0xdbe7ff, 3.2, 20);
  fillLight.position.set(-4, -2, 3);
  scene.add(fillLight);

  // Rim light to create glittering specular contours
  const rimLight = new THREE.DirectionalLight(0xffe8ba, 4.0);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  return { keyLight, fillLight, rimLight };
}
