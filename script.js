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

// Hexagon glow effect on mouse move
const largeHexagon = document.querySelector('.large-hexagon');
if (largeHexagon) {
    largeHexagon.addEventListener('mousemove', (e) => {
        const rect = largeHexagon.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const glow = largeHexagon.querySelector('.hexagon-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.4) 0%, transparent 70%)`;
        }
    });

    largeHexagon.addEventListener('mouseleave', () => {
        const glow = largeHexagon.querySelector('.hexagon-glow');
        if (glow) {
            glow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)';
        }
    });
}

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
const tryButton = document.getElementById('vapi-try-button');
const endButton = document.getElementById('vapi-end-button');
const overlay = document.getElementById('vapi-overlay');

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
            if (tryButton) {
                tryButton.innerHTML = 'Try It';
                tryButton.disabled = false;
                tryButton.style.cursor = 'pointer';
            }
            if (overlay) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (typeof initVisualizer === 'function') initVisualizer();
            }
        });

            vapiInstance.on('volume-level', (volume) => {
                if (sphereVisualizer) sphereVisualizer.updateVolume(volume);
            });

            vapiInstance.on('call-end', () => {
                console.log('Call has ended');
                if (tryButton) {
                    tryButton.innerHTML = 'Try It';
                    tryButton.disabled = false;
                    tryButton.style.cursor = 'pointer';
                }
                if (overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            vapiInstance.on('error', (e) => {
                console.error('Vapi Error Detail:', e);
                
                if (tryButton) {
                    tryButton.innerHTML = 'Try It';
                    tryButton.disabled = false;
                    tryButton.style.cursor = 'pointer';
                }
                
                let errorMsg = 'An unexpected error occurred.';
                if (typeof e === 'string') errorMsg = e;
                else if (e.message) errorMsg = e.message;
                else if (e.error && e.error.msg) errorMsg = e.error.msg;

                if (window.location.protocol === 'file:') {
                    alert('CRITICAL: Vapi cannot connect via "file://". You MUST use a local server (http://localhost:8080) or upload to Netlify/Vercel.');
                } else if (errorMsg.includes('ejected') || errorMsg.includes('ended')) {
                    alert('Call Ended: The session was disconnected. This usually happens if the Mic is blocked or the Vapi keys are invalid.');
                } else {
                    alert(`Vapi Error: ${errorMsg}`);
                }

                if (overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
    } catch (err) {
        console.error('Error creating Vapi instance:', err);
    }
};

// Start initialization check
if (tryButton) {
    // Attempt init after a short delay to ensure script loading
    setTimeout(initVapi, 1000);

    tryButton.addEventListener('click', async () => {
        // Enforce protocol check
        if (window.location.protocol === 'file:') {
            alert('SECURITY ERROR: Vapi Voice AI requires a secure connection (HTTPS or Localhost). \n\nPlease run "python3 -m http.server 8080" and visit http://localhost:8080');
            return;
        }

        if (!vapiInstance) {
            const originalText = tryButton.textContent;
            tryButton.textContent = "Loading...";
            tryButton.disabled = true;
            await initVapi();
            tryButton.textContent = originalText;
            tryButton.disabled = false;
        }
        
        if (vapiInstance) {
            tryButton.innerHTML = '<span class="vapi-spinner"></span> Connecting...';
            tryButton.disabled = true;
            tryButton.style.cursor = 'wait';
            vapiInstance.start(VAPI_ASSISTANT_ID);
        } else {
            alert('Vapi SDK failed to load. Please refresh and try again or use a local server.');
        }
    });

    if (endButton) {
        endButton.addEventListener('click', () => {
            if (vapiInstance) vapiInstance.stop();
        });
    }
}
// --- 3D Technical Merchandise Viewer ---

/**
 * Updates the main product image and atmospheric background
 */
function updateProductColor(color, imgSrc) {
    const mainImg = document.getElementById('main-product-img');
    const container = document.querySelector('.merchandise-container');
    const swatches = document.querySelectorAll('.swatch');

    if (!mainImg || !container) return;

    // Update Image with fade effect
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = imgSrc;
        mainImg.style.opacity = '1';
    }, 300);

    // Update Background Atmosphere
    container.className = 'merchandise-container section section-alt ' + `bg-${color}`;

    // Update active swatch
    swatches.forEach(s => s.classList.remove('active'));
    const activeSwatch = Array.from(swatches).find(s => s.title.toLowerCase().includes(color));
    if (activeSwatch) activeSwatch.classList.add('active');
}

/**
 * Initializes the 3D Tilt and Lighting effect
 */
function init3DViewer() {
    const card = document.querySelector('.merch-feature-image');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation (center is 0,0)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        // Apply 3D Rotation
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Update Lighting (Shine overlay)
        const shine = card.style.setProperty('--shine-x', `${x}px`);
        const shineY = card.style.setProperty('--shine-y', `${y}px`);
        
        // Dynamic lighting update via CSS custom properties
        card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 80%)`;
    });

    card.addEventListener('mouseleave', () => {
        // Reset to neutral position
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        card.style.transition = 'transform 0.5s ease';
        card.style.backgroundImage = '';
        setTimeout(() => {
            card.style.transition = 'transform 0.1s ease-out';
        }, 500);
    });
}

// Initialize on load
window.addEventListener('load', () => {
    init3DViewer();
    // Default to Obsidian background
    const container = document.querySelector('.merchandise-container');
    if (container) container.classList.add('bg-obsidian');
});
