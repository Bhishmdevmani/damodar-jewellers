import * as THREE from 'three';

/**
 * Creates a photorealistic HDR studio environment map using PMREMGenerator
 * with broad softbox panels to create realistic, high-end jewellery reflections.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const studioScene = new THREE.Scene();
  studioScene.background = new THREE.Color(0x0a0907);

  // 1. Broad Overhead Softbox (creates long, luxurious specular curves across gold)
  const overheadGeo = new THREE.PlaneGeometry(8, 8);
  const overheadMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xfff5e6),
    side: THREE.DoubleSide,
  });
  const overheadSoftbox = new THREE.Mesh(overheadGeo, overheadMat);
  overheadSoftbox.position.set(0, 6, 2);
  overheadSoftbox.rotation.x = Math.PI / 2;
  studioScene.add(overheadSoftbox);

  // 2. Left Key Softbox Panel (warm champagne fill)
  const leftGeo = new THREE.PlaneGeometry(6, 10);
  const leftMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffe8ba),
    side: THREE.DoubleSide,
  });
  const leftSoftbox = new THREE.Mesh(leftGeo, leftMat);
  leftSoftbox.position.set(-6, 2, 4);
  leftSoftbox.rotation.y = Math.PI / 3;
  studioScene.add(leftSoftbox);

  // 3. Right Rim Softbox Panel (crisp highlight for edges and gemstones)
  const rightGeo = new THREE.PlaneGeometry(5, 10);
  const rightMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xf5f8ff),
    side: THREE.DoubleSide,
  });
  const rightSoftbox = new THREE.Mesh(rightGeo, rightMat);
  rightSoftbox.position.set(6, 3, -2);
  rightSoftbox.rotation.y = -Math.PI / 3;
  studioScene.add(rightSoftbox);

  // 4. Subtle Front Ring Reflector (for catching front facet fire)
  const frontGeo = new THREE.RingGeometry(2, 4, 32);
  const frontMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xfffaec),
    side: THREE.DoubleSide,
  });
  const frontReflector = new THREE.Mesh(frontGeo, frontMat);
  frontReflector.position.set(0, 0, 7);
  studioScene.add(frontReflector);

  const envMap = pmremGenerator.fromScene(studioScene, 0.04);
  pmremGenerator.dispose();

  // Clean up temporary geometries and materials
  overheadGeo.dispose();
  overheadMat.dispose();
  leftGeo.dispose();
  leftMat.dispose();
  rightGeo.dispose();
  rightMat.dispose();
  frontGeo.dispose();
  frontMat.dispose();

  return envMap;
}

/**
 * Enhanced direct physical lights to illuminate the necklace in the main scene
 */
export function setupLuxuryStudioLighting(scene: THREE.Scene): {
  keyLight: THREE.SpotLight;
  fillLight: THREE.PointLight;
  rimLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
} {
  // 1. Warm Ambient Base (prevents dark pitch-black shadows in gold crevices)
  const ambientLight = new THREE.AmbientLight(0xfff3db, 1.8);
  scene.add(ambientLight);

  // 2. Focused Key Spotlight (simulates main jewelry loupe/table lamp)
  const keyLight = new THREE.SpotLight(0xfffaec, 8.5);
  keyLight.position.set(3.5, 6.5, 5.0);
  keyLight.angle = Math.PI / 3.5;
  keyLight.penumbra = 0.55;
  keyLight.decay = 1.2;
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  // 3. Cool Accent Fill Light (provides depth and color contrast on gold curves)
  const fillLight = new THREE.PointLight(0xdce7ff, 4.0, 25);
  fillLight.position.set(-5.0, -1.0, 4.0);
  fillLight.decay = 1.4;
  scene.add(fillLight);

  // 4. Specular Golden Rim Light (grazing back light for halo & chain silhouette)
  const rimLight = new THREE.DirectionalLight(0xffe29e, 5.5);
  rimLight.position.set(0, 5.0, -4.5);
  scene.add(rimLight);

  return { keyLight, fillLight, rimLight, ambientLight };
}
