/**
 * Ilmenite 3D Vertex Sphere Visualizer
 * Uses Three.js to create a responsive, interactive vertex sphere
 * with wave displacement reacting to audio volume.
 */

class VertexSphereVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.points = null;
        this.geometry = null;
        this.material = null;
        
        this.time = 0;
        this.volume = 0;
        this.isRotating = false;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        
        this.init();
        this.addEventListeners();
        this.animate();
    }

    init() {
        const radius = 2;
        const widthSegments = 64;
        const heightSegments = 64;

        this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        
        // Convert to points
        const positions = this.geometry.attributes.position.array;
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Original positions for displacement reference
        this.originalPositions = new Float32Array(positions);

        this.material = new THREE.PointsMaterial({
            color: 0xd4af37, // Gold
            size: 0.04,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);

        this.camera.position.z = 5;
        this.resize();
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());

        // Interactive Rotation
        this.container.addEventListener('mousedown', (e) => this.startRotate(e));
        window.addEventListener('mousemove', (e) => this.rotate(e));
        window.addEventListener('mouseup', () => this.stopRotate());

        this.container.addEventListener('touchstart', (e) => this.startRotate(e.touches[0]), { passive: true });
        window.addEventListener('touchmove', (e) => this.rotate(e.touches[0]), { passive: false });
        window.addEventListener('touchend', () => this.stopRotate());
    }

    startRotate(e) {
        this.isRotating = true;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
    }

    rotate(e) {
        if (!this.isRotating) return;
        
        const deltaX = e.clientX - this.prevMouseX;
        const deltaY = e.clientY - this.prevMouseY;

        this.points.rotation.y += deltaX * 0.01;
        this.points.rotation.x += deltaY * 0.01;

        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
        
        // Prevent scrolling on touch
        if (e.preventDefault) e.preventDefault();
    }

    stopRotate() {
        this.isRotating = false;
    }

    updateVolume(vol) {
        // Smooth volume transition
        this.volume = THREE.MathUtils.lerp(this.volume, vol, 0.1);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Spawn animation: scale points up from 0
        if (!this.spawnedScale) this.spawnedScale = 0;
        if (this.spawnedScale < 1) {
            this.spawnedScale = THREE.MathUtils.lerp(this.spawnedScale, 1.05, 0.03);
            this.points.scale.set(this.spawnedScale, this.spawnedScale, this.spawnedScale);
        }

        const positions = this.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = this.originalPositions[i];
            const y = this.originalPositions[i + 1];
            const z = this.originalPositions[i + 2];

            // Calculate distance from center
            const dist = Math.sqrt(x*x + y*y + z*z);
            
            // Ocean wave effect using Sine waves + volume displacement
            const wave = Math.sin(x * 2 + this.time * 2) * Math.cos(y * 2 + this.time * 1.5) * (0.1 + this.volume * 1.5);

            
            const scale = 1 + wave;
            
            positions[i] = x * scale;
            positions[i + 1] = y * scale;
            positions[i + 2] = z * scale;
        }

        this.geometry.attributes.position.needsUpdate = true;
        
        // Subtle auto-rotation when not being dragged
        if (!this.isRotating) {
            this.points.rotation.y += 0.002;
            this.points.rotation.x += 0.001;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Global instance to be accessed by script.js
let sphereVisualizer = null;
function initVisualizer() {
    if (!sphereVisualizer) {
        sphereVisualizer = new VertexSphereVisualizer('vapi-visualizer-container');
    } else {
        // Reset scale for re-entry animation
        sphereVisualizer.spawnedScale = 0;
        if (sphereVisualizer.points) {
            sphereVisualizer.points.scale.set(0, 0, 0);
        }
    }
}
