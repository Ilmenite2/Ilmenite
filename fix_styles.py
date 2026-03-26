import re

with open('styles.css', 'r') as f:
    css = f.read()

# Replace the CINEMATIC PAGING block entirely
pattern1 = r"/\* --- CINEMATIC PAGING & SECTION NORMALIZATION ---\*/.*?}\s*}"
replacement1 = """/* --- CINEMATIC PAGING & SECTION NORMALIZATION --- */
section, 
.hero, 
.merch-empire, 
.solutions, 
.backing-section, 
#contact {
    height: 100vh !important;
    height: calc(var(--vh, 1vh) * 100) !important;
    overflow-y: auto !important;
    display: flex !important;
    flex-direction: column !important;
    /* justify-content: flex-start ensures top doesn't cut off if scrolling */
    justify-content: flex-start !important;
    padding: 80px 0 !important;
    position: relative !important;
    scroll-snap-align: start;
    align-items: center;
}

.section > .container {
    margin: auto 0;
    width: 100%;
}

.hero {
    height: 100vh !important;
    padding: 0 !important;
}

@media (max-width: 1000px) {
    section, .hero, .merch-empire, .solutions, .backing-section, .contact {
        padding: 50px 0 20px 0 !important;
    }
}
"""
css = re.sub(r"/\* --- CINEMATIC PAGING & SECTION NORMALIZATION --- \*/.*?}\n\n}", replacement1, css, flags=re.DOTALL)

# Replace the MOBILE STICKY OPTIMIZATION block entirely
pattern2 = r"/\* --- MOBILE STICKY OPTIMIZATION --- \*/.*?(?=/\* --- PULSE BUTTON ANIMATION --- \*/)"
replacement2 = """/* --- MOBILE STICKY OPTIMIZATION --- */
@media (max-width: 1000px) {
    #merch-empire-grid {
        grid-template-columns: 1fr !important;
        text-align: center !important;
        gap: 20px !important;
        padding-top: 10px !important;
    }
    
    #merch-empire-visual {
        position: relative !important;
        top: auto !important;
        height: 25vh !important;
        z-index: 10 !important;
        background: radial-gradient(circle, rgba(139, 115, 85, 0.1) 0%, transparent 70%) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
        border-bottom: none !important;
        border-radius: 20px !important;
    }

    .merch-empire-visual img {
        max-height: 90% !important;
        max-width: auto !important;
    }

    .merch-empire-details {
        padding: 0 10px !important;
        align-items: center !important;
    }

    .merch-empire-swatches {
        justify-content: center !important;
    }

    .mobile-compact-controls {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 12px !important;
        margin-bottom: 20px !important;
        padding: 0 !important;
        width: 100% !important;
    }

    .merch-empire-price {
        font-size: 2.2rem !important;
        margin-bottom: 5px !important;
    }

    /* Compress Works Grid Mobile */
    .works-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .work-card {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .work-image {
        width: 130px;
        height: auto;
        aspect-ratio: 1;
        flex-shrink: 0;
    }

    .work-image img {
        max-width: 90%;
    }

    .work-info {
        padding: 10px 15px;
    }

    .work-info p {
        display: none;
    }

    .work-card h3 {
        font-size: 1.2rem;
        margin-bottom: 5px;
    }

    .card-buttons {
        margin-top: 5px !important;
        flex-wrap: wrap;
    }

    .btn {
        padding: 8px 16px;
        font-size: 0.85rem;
    }
    
    .status-badge {
        font-size: 0.55rem;
        padding: 4px 8px;
        top: 8px;
        left: 8px;
    }

    .work-tags {
        display: none;
    }

    .section-header {
        margin-bottom: 1.5rem;
    }

    .section-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .section-header p {
        font-size: 1rem;
    }
}
"""
css = re.sub(pattern2, replacement2, css, flags=re.DOTALL)

with open('styles.css', 'w') as f:
    f.write(css)

print("Styles updated.")
