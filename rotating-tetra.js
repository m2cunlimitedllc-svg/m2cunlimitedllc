// rotating-tetra.js

class RotatingTetra extends HTMLElement {
  constructor() {
    super();
    this._initialized = false;
  }

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    const shadow = this.attachShadow({ mode: 'open' });

    // Container + canvas
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'block';
    container.style.position = 'relative';
    shadow.appendChild(container);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Load Three.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => this.initThree(canvas, container);
    shadow.appendChild(script);
  }

  initThree(canvas, container) {
    const THREE = window.THREE;
    if (!THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });

    const resize = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // Tetrahedron
    const geometry = new THREE.TetrahedronGeometry(2);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff4444 }),
      new THREE.MeshBasicMaterial({ color: 0x44ff44 }),
      new THREE.MeshBasicMaterial({ color: 0x4444ff }),
      new THREE.MeshBasicMaterial({ color: 0xffff44 })
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    scene.add(mesh);

    camera.position.z = 6;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Click handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const faceLinks = [
      'https://example1.com',
      'https://example2.com',
      'https://example3.com',
      'https://example4.com'
    ];

    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mesh);

      if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2);
        const url = faceLinks[faceIndex] || faceLinks[0];
        window.location.href = url;
      }
    });
  }
}

customElements.define('rotating-tetra', RotatingTetra);
