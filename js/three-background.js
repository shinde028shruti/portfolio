/**
 * Three.js 3D Background Interactive Mesh & Constellation
 * Smooth, lightweight, high-performance ambient 3D scene
 */

(function initThreeBackground() {
  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    console.warn('WebGL not supported, falling back gracefully:', e);
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle Constellation
  const particleCount = window.innerWidth < 768 ? 90 : 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 80;
    positions[i + 1] = (Math.random() - 0.5) * 60;
    positions[i + 2] = (Math.random() - 0.5) * 40;

    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 1.4,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Floating 3D Geometric Polygonal Nodes
  const polyGroup = new THREE.Group();

  // Floating Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(5, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const icoMesh = new THREE.Mesh(icoGeo, wireMaterial);
  icoMesh.position.set(-24, 12, -10);
  polyGroup.add(icoMesh);

  // Floating Octahedron
  const octGeo = new THREE.OctahedronGeometry(4, 0);
  const octMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const octMesh = new THREE.Mesh(octGeo, octMaterial);
  octMesh.position.set(26, -14, -8);
  polyGroup.add(octMesh);

  // Floating Torus (Donut Mesh)
  const torGeo = new THREE.TorusGeometry(3.5, 0.8, 8, 24);
  const torMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const torMesh = new THREE.Mesh(torGeo, torMaterial);
  torMesh.position.set(22, 16, -15);
  polyGroup.add(torMesh);

  scene.add(polyGroup);

  // Ambient Mouse Parallax Tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Smooth camera mouse follow
    targetX += (mouseX * 4 - targetX) * 0.05;
    targetY += (-mouseY * 3 - targetY) * 0.05;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Slowly rotate meshes
    icoMesh.rotation.x += 0.003;
    icoMesh.rotation.y += 0.004;

    octMesh.rotation.y -= 0.005;
    octMesh.rotation.z += 0.003;

    torMesh.rotation.x += 0.004;
    torMesh.rotation.z -= 0.002;

    // Drift particles
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx] += velocities[i].x;
      pos[idx + 1] += velocities[i].y;
      pos[idx + 2] += velocities[i].z;

      // Wrap around bounds
      if (pos[idx] > 40) pos[idx] = -40;
      if (pos[idx] < -40) pos[idx] = 40;
      if (pos[idx + 1] > 30) pos[idx + 1] = -30;
      if (pos[idx + 1] < -30) pos[idx + 1] = 30;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
})();
