// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', (!expanded).toString());
        hamburger.setAttribute('aria-label', isActive ? 'Close menu' : 'Open menu');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
// Observe elements for animation
document.querySelectorAll('.work-card, .merch-item, .feature, .value-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form submission (Web3Forms)
const contactForm = document.querySelector('form[action="https://api.web3forms.com/submit"]');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[name="name"]')?.value?.trim();
        const email = this.querySelector('input[name="email"]')?.value?.trim();
        const inquiryType = this.querySelector('select[name="inquiry_type"]')?.value;
        const message = this.querySelector('textarea[name="message"]')?.value?.trim();

        // Validation
        if (!name || !email || !inquiryType || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Submit via fetch to Web3Forms
        const submitButton = this.querySelector('.btn-primary');
        const originalText = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(this.action, {
                method: this.method || 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('Thank you for your message. We will get back to you soon.');
                this.reset();
            } else {
                const data = await response.json().catch(() => null);
                const msg = data && data.message ? data.message : 'Submission failed. Please try again later.';
                alert(msg);
            }
        } catch (err) {
            alert('Network error. Please check your connection and try again.');
        } finally {
            if (submitButton) {
                submitButton.textContent = originalText || 'Send Message';
                submitButton.disabled = false;
            }
        }
    });
}

// Hexagon glow effect removed (replaced by 2D canvas engine)

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 500);
    }
});

// Add hover effects to cards
document.querySelectorAll('.work-card, .merch-item').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--gold), var(--khaki));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Fix 100vh on Mobile/Instagram Browsers
    function setVh() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVh();
    window.addEventListener('resize', setVh);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();


// Add subtle animations to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(139, 115, 85, 0.3)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Add active states to navigation
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--khaki) !important;
    }
    .nav-menu a.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Slideshow Logic
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length < 2) return;

    let currentSlide = 0;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); // 4 seconds per slide
}

// Init when loaded
window.addEventListener('load', initSlideshow);

// --- Vapi Voice AI Integration ---
const VAPI_PUBLIC_KEY = '6048d665-b4a4-48a2-ac93-d56e01703987';
const VAPI_ASSISTANT_ID = 'a7842df6-67b3-4978-bdd5-705daff1ffba';

let vapiInstance = null;
let vapiButton = null;
let endButton = null;
let overlay = null;

function setupVapiInteractions() {
    vapiButton = document.getElementById('vapi-start-button');
    endButton = document.getElementById('vapi-end-button');
    overlay = document.getElementById('vapi-overlay');

    if (vapiButton) {
        setTimeout(initVapi, 500);
        vapiButton.addEventListener('click', async () => {
            // Immediate Feedback for Security Origin
            if (window.location.protocol === 'file:') {
                showNotification("SECURITY: PLEASE RUN ON LOCALHOST OR HTTPS.");
                return;
            }

            try {
                if (!vapiInstance) await initVapi();
                if (vapiInstance) {
                    vapiButton.innerHTML = '<span class="vapi-spinner"></span> Connecting...';
                    haptic([20, 20, 20, 50, 20, 50, 20, 50]);
                    
                    // Connection Timeout
                    const connectionTimeout = setTimeout(() => {
                        vapiButton.innerHTML = 'Speak with Atsh';
                        showNotification("VAPI TIMEOUT: CHECK CONNECTION.");
                    }, 12000);

                    vapiInstance.once('call-start', () => clearTimeout(connectionTimeout));
                    vapiInstance.once('error', () => clearTimeout(connectionTimeout));

                    await vapiInstance.start(VAPI_ASSISTANT_ID);
                } else {
                    showNotification("VAPI ERROR: SDK NOT LOADED.");
                }
            } catch (err) {
                console.error('Vapi Start Error:', err);
                vapiButton.innerHTML = 'Speak with Atsh';
                showNotification("VAPI ERROR: " + (err.message || "FAILED TO START"));
            }
        });
    }

    if (endButton) {
        endButton.addEventListener('click', () => {
            if (vapiInstance) vapiInstance.stop();
        });
    }
}

/**
 * Initialize Vapi and setup listeners
 */
const initVapi = async () => {
    if (vapiInstance) return;

    try {
        let VapiConstructor = window.Vapi || 
                             (window.vapiSDK ? window.vapiSDK.default : null) || 
                             (typeof vapiSDK !== 'undefined' ? vapiSDK.default : null);

        if (!VapiConstructor) {
            const module = await import('https://esm.sh/@vapi-ai/web');
            VapiConstructor = module.default || module;
            window.Vapi = VapiConstructor;
        }

        vapiInstance = new VapiConstructor(VAPI_PUBLIC_KEY);
        console.log('Vapi initialized successfully');
            
        vapiInstance.on('call-start', () => {
            console.log('Call has started');
            haptic([100, 50, 100]); // Start buzz
            if (vapiButton) {
                vapiButton.innerHTML = 'Speak with Atsh';
                vapiButton.disabled = false;
            }
            if (overlay) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        vapiInstance.on('call-end', () => {
            if (vapiButton) vapiButton.innerHTML = 'Speak with Atsh';
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        vapiInstance.on('error', (e) => {
            console.error('Vapi Error:', e);
            if (vapiButton) vapiButton.innerHTML = 'Speak with Atsh';
            
            let msg = "VAPI ERROR: CONNECTION RESTRICTED.";
            if (window.location.protocol === 'file:') {
                msg = "SECURITY: PLEASE RUN ON LOCALHOST OR HTTPS.";
            } else if (e.message && e.message.includes('mic')) {
                msg = "PERMISSION: MICROPHONE ACCESS BLOCKED.";
            } else if (e.message && e.message.includes('key')) {
                msg = "AUTH: INVALID VAPI PUBLIC KEY.";
            }
            showNotification(msg);
        });
    } catch (err) {
        console.error('Error creating Vapi instance:', err);
    }
};


/**
 * --- KINETIC MERCHANDISE INTERFACE ---
 */
function updateProductColor(color, imgSrc) {
    const mainImg = document.getElementById('main-product-img');
    const swatches = document.querySelectorAll('.merch-empire-swatch');

    if (!mainImg) return;

    // Cinematic Transition: Shrink and Blur
    mainImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    mainImg.style.opacity = '0.3';
    mainImg.style.filter = 'blur(10px) drop-shadow(0 20px 40px rgba(0,0,0,0.5))';
    mainImg.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        mainImg.src = imgSrc;
        mainImg.style.opacity = '1';
        mainImg.style.filter = 'blur(0px) drop-shadow(0 20px 40px rgba(0,0,0,0.5))';
        mainImg.style.transform = 'scale(1)';
    }, 400);

    // Update active swatch
    swatches.forEach(s => s.classList.remove('active'));
    const activeSwatch = Array.from(swatches).find(s => s.title.toLowerCase().includes(color));
    if (activeSwatch) activeSwatch.classList.add('active');
    
    // Haptic Feedback for swatch change
    haptic([50, 50, 50, 50]);
}

function initKineticDrift() {
    const container = document.getElementById('merch-empire-visual');
    const img = document.getElementById('main-product-img');
    
    if (!container || !img) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    });

    container.addEventListener('mouseleave', () => {
        img.style.transform = 'translate(0, 0)';
    });
}


/**
 * --- HEXAGON PATTERN ENGINE ---
 */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Fluid Lag Mouse: target vs current
    let targetX = -2000, targetY = -2000;
    let currentX = -2000, currentY = -2000;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    const hero = canvas.closest('.hero');
    if (hero) {
        hero.addEventListener('mousemove', e => { 
            targetX = e.clientX; 
            targetY = e.clientY; 
        });
        hero.addEventListener('mouseleave', () => { 
            targetX = -2000; 
            targetY = -2000; 
        });
    }

    window.addEventListener('resize', resize);

    const hexRadius = 40;
    const hexWidth = hexRadius * Math.sqrt(3);
    const hexHeight = hexRadius * 2;

    function drawHex(x, y, opacity) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - (Math.PI / 6);
            ctx.lineTo(x + hexRadius * Math.cos(angle), y + hexRadius * Math.sin(angle));
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(139, 115, 85, ${opacity})`;
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Fluid Mouse Lerp (0.05 factor for elite lag)
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        // Scroll Fade: Canvas disappears as we move down
        const scrollY = window.pageYOffset;
        const scrollAlpha = Math.max(0, 1 - scrollY / 600);
        canvas.style.opacity = scrollAlpha;

        const time = Date.now() * 0.001;
        const colCount = Math.ceil(width / hexWidth) + 1;
        const rowCount = Math.ceil(height / (hexHeight * 0.75)) + 1;

        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                let x = c * hexWidth + (r % 2 !== 0 ? hexWidth/2 : 0);
                let y = r * hexHeight * 0.75;
                
                // Mouse proximity - with lerped coordinates
                const dist = Math.sqrt((x - currentX)**2 + (y - currentY)**2);
                let opacity = Math.max(0.04, 0.08 + (1 - dist/450) * 0.5);
                
                // Enhanced Ocean Waves
                const wave1 = Math.sin(x * 0.004 + y * 0.002 + time * 1.5) * 0.12;
                const wave2 = Math.cos(x * 0.002 - y * 0.005 + time * 1.0) * 0.1;
                opacity += wave1 + wave2;
                
                drawHex(x, y, Math.max(0, opacity * scrollAlpha));
            }
        }
        requestAnimationFrame(animate);
    }
    resize(); animate();
}

/**
 * --- EXECUTIVE HAPTIC ENGINE ---
 */
function haptic(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

function initExecutiveInteractions() {
    // Order / Partnership (BIIZZzzzzzwww)
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.id !== 'vapi-start-button') {
            btn.addEventListener('click', () => haptic([500, 100, 500]));
        }
    });
    // Swatches (Tactile BZ BIZ)
    document.querySelectorAll('.merch-empire-swatch').forEach(btn => {
        btn.addEventListener('click', () => haptic([50, 50, 50, 50]));
    });
    // Secondary Actions (Drop)
    document.querySelectorAll('select, .btn-outline').forEach(el => {
        el.addEventListener('click', () => haptic([100]));
    });
}

// Global Activation
// Global Activation (Final Unified)
window.addEventListener('load', () => {
    setupVapiInteractions(); 
    initHeroCanvas();
    initKineticDrift();
    initExecutiveInteractions();
    initIntersectionObserver();
    detectInAppBrowser();
    initSmoothScroll();
    
    // System Status Update
    setTimeout(() => {
        showNotification("SYSTEM CORE: ONLINE | AI READY");
    }, 1500);
});

/**
 * Cinematic Reveal Tracking
 */
function initIntersectionObserver() {
    const options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, options);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/**
 * Detect In-App Browsers (Instagram, Facebook) for analytics
 */
function detectInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf('Instagram') > -1) || (ua.indexOf('FBAN') > -1);
}

/**
 * Show a premium executive notification toast
 */
function showNotification(msg) {
    const container = document.getElementById('executive-notifications');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = msg;
    
    container.appendChild(toast);
    
    // Force reflow for animation
    setTimeout(() => toast.classList.add('active'), 10);
    
    // Auto-remove
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 600);
    }, 5000);
}

/**
 * Smooth Scroll for all anchors
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}


