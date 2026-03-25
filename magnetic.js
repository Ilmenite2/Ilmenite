/**
 * Hexagon Grid Effect - CLUSTER PULSE EDITION
 * - Logic Refactor: Uses "Virtual Pulse Sources" instead of individual hex toggling.
 * - Effect: Spawns a temporary "ghost mouse" at random locations.
 * - Result: Groups of hexagons light up with a radial gradient (Center bright, edges fading).
 */

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let hexagons = [];
let pulses = []; // Array of active pulse sources
const hexRadius = 30;
const hexWidth = hexRadius * 2;
const hexHeight = hexRadius * Math.sqrt(3);

// Mouse State
const mouse = { x: -1000, y: -1000 };
let lastMouseMove = Date.now();
const IDLE_THRESHOLD = 2000;
let isMouseOffScreen = true;

// Color: Gold Glow
const colorHex = '212, 175, 55';

// Virtual Pulse Source (Refactored logic)
class Pulse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.lifespan = 150; // Cycles (approx 2.5 seconds)
        this.maxRadius = hexRadius * 4.5; // Large cluster (center + ~2 layers)
        this.intensity = 0;
    }

    update() {
        this.age++;
        // Sine wave intensity: Rise fast, hold, fade slow
        // 0 -> 1 -> 0
        const progress = this.age / this.lifespan;

        // Custom easing: Fast in, slow out
        if (progress < 0.2) {
            this.intensity = progress * 5; // 0 to 1 in 20% time
        } else {
            this.intensity = 1 - ((progress - 0.2) * 1.25); // Fade out rest of time
        }

        if (this.intensity < 0) this.intensity = 0;
    }
}

class Hexagon {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.opacity = 0;
        this.targetOpacity = 0;
    }

    update() {
        let maxIntensity = 0;

        // 1. Calculate Mouse Intensity (High Priority)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distMouse = Math.sqrt(dx * dx + dy * dy);

        if (distMouse < hexRadius * 3) {
            maxIntensity = 1 - (distMouse / (hexRadius * 3));
        }

        // 2. Calculate Pulse Intensity (Summative or Max?)
        // Let's use Max to prevent blowing out brightness
        pulses.forEach(pulse => {
            const pdx = pulse.x - this.x;
            const pdy = pulse.y - this.y;
            const distPulse = Math.sqrt(pdx * pdy + pdy * pdy); // squared for speed? No, need linear fade

            if (distPulse < pulse.maxRadius) {
                // Dimmer than mouse (0.7 max)
                const intensity = (1 - (distPulse / pulse.maxRadius)) * pulse.intensity * 0.7;
                if (intensity > maxIntensity) maxIntensity = intensity;
            }
        });

        this.targetOpacity = maxIntensity;

        // Smooth Transition
        if (this.targetOpacity > this.opacity) {
            this.opacity += (this.targetOpacity - this.opacity) * 0.1; // Fast rise
        } else {
            this.opacity -= 0.005; // Slow decay
        }

        // Clamp
        if (this.opacity < 0) this.opacity = 0;
        if (this.opacity > 0.9) this.opacity = 0.9;
    }

    draw() {
        if (this.opacity <= 0.01) return;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = this.x + this.r * Math.cos(angle);
            const hy = this.y + this.r * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();

        ctx.strokeStyle = `rgba(${colorHex}, ${this.opacity * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = `rgba(${colorHex}, ${this.opacity * 0.15})`;
        ctx.fill();
    }
}

function init() {
    resize();
    animate();
}

function resize() {
    width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createGrid();
}

function createGrid() {
    hexagons = [];
    const xStep = hexRadius * 1.5;
    const yStep = hexRadius * Math.sqrt(3);
    const numCols = Math.ceil(width / xStep) + 2;
    const numRows = Math.ceil(height / (yStep / 2)) + 2;

    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
            const x = col * xStep;
            let y = row * (yStep / 2);

            if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
                hexagons.push(new Hexagon(x, y, hexRadius));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update Pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].update();
        if (pulses[i].age >= pulses[i].lifespan) {
            pulses.splice(i, 1);
        }
    }

    // IDLE LOGIC
    const timeSinceMove = Date.now() - lastMouseMove;
    const isMouseInHero = (mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height);
    const isIdle = (timeSinceMove > IDLE_THRESHOLD) || isMouseOffScreen || !isMouseInHero;

    if (isIdle) {
        // Spawn Pulse
        // Lower chance because pulses last longer now
        if (Math.random() < 0.008) { // ~Every 2 seconds
            // Pick a random location (not just a hex center, but anywhere)
            const rx = Math.random() * width;
            const ry = Math.random() * height;
            pulses.push(new Pulse(rx, ry));
        }
    }

    hexagons.forEach(hex => {
        hex.update();
        hex.draw();
    });

    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    isMouseOffScreen = false;
    lastMouseMove = Date.now();
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
window.addEventListener('mouseleave', () => {
    isMouseOffScreen = true;
    mouse.x = -1000;
    mouse.y = -1000;
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
