/**
 * Main application entry point
 * Initializes the AdvancedParticleSphere visualizer and sets up the modern control panel
 */

// Global variables
let particleSphere;
let fpsCounter = 0;
let lastFpsTime = performance.now();

/**
 * Initialize the application when the page loads
 */
function init() {
    console.log('Initializing Advanced 3D Particle Sphere Visualizer...');
    
    const loadingElement = document.getElementById('loading');
    const container = document.getElementById('container');
    
    if (!container) {
        console.error('Container element not found!');
        if (loadingElement) {
            loadingElement.textContent = 'Error: container not found';
            loadingElement.style.color = '#ff6b6b';
        }
        return;
    }
    
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded!');
        if (loadingElement) {
            loadingElement.textContent = 'Error: Three.js failed to load. Check network or try opening from a server.';
            loadingElement.style.color = '#ff6b6b';
        }
        return;
    }
    
    try {
        particleSphere = new AdvancedParticleSphere(container);
        console.log('AdvancedParticleSphere created successfully');
    } catch (error) {
        console.error('Error creating AdvancedParticleSphere:', error);
        if (loadingElement) {
            loadingElement.textContent = 'Error: ' + (error.message || 'Failed to start');
            loadingElement.style.color = '#ff6b6b';
        }
        return;
    }
    
    if (loadingElement) loadingElement.style.display = 'none';
    
    setupControlPanel();
    startFpsCounter();
    console.log('Advanced 3D Particle Sphere Visualizer initialized successfully!');
}

/**
 * Panel expands from CTA: scales from button size to full panel, content animates in smoothly.
 */
function setupControlPanel() {
    const container = document.getElementById('controlPanelContainer');
    const cta = document.getElementById('controlPanelCta');
    const menu = document.getElementById('controlPanelMenu');
    const closeBtn = document.getElementById('closeControlPanel');
    const backdrop = document.getElementById('controlPanelBackdrop');
    const PANEL_WIDTH = 320;
    const PANEL_HEIGHT_REF = 400;

    function openPanel() {
        const ctaRect = cta.getBoundingClientRect();
        const scaleX = ctaRect.width / PANEL_WIDTH;
        const scaleY = ctaRect.height / PANEL_HEIGHT_REF;
        
        menu.style.transform = `scale(${scaleX}, ${scaleY})`;
        container.classList.add('is-open');
        cta.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        backdrop.classList.add('visible');
        
        requestAnimationFrame(() => {
            menu.style.transform = 'scale(1, 1)';
        });
    }

    function closePanel() {
        const ctaRect = cta.getBoundingClientRect();
        const scaleX = ctaRect.width / PANEL_WIDTH;
        const scaleY = ctaRect.height / PANEL_HEIGHT_REF;
        
        menu.style.transform = 'scale(1, 1)';
        container.classList.remove('is-open');
        cta.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        backdrop.classList.remove('visible');
        
        requestAnimationFrame(() => {
            menu.style.transform = `scale(${scaleX}, ${scaleY})`;
        });
    }

    cta.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (container.classList.contains('is-open')) closePanel();
        else openPanel();
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePanel();
    });

    backdrop.addEventListener('click', closePanel);

    document.addEventListener('click', (e) => {
        if (container.classList.contains('is-open') && !container.contains(e.target)) {
            closePanel();
        }
    });
    
    setupParticleControls();
    setupMorphingControls();
}



/**
 * Setup particle system controls
 */
function setupParticleControls() {
    // Particle size slider
    const particleSizeSlider = document.getElementById('particleSizeSlider');
    const particleSizeValue = document.getElementById('particleSizeValue');
    
    particleSizeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        particleSizeValue.textContent = value.toFixed(3);
        if (particleSphere && typeof particleSphere.setParticleSize === 'function') {
            particleSphere.setParticleSize(value);
        }
    });
    
    // Particle count slider
    const particleCountSlider = document.getElementById('particleCountSlider');
    const particleCountValue = document.getElementById('particleCountValue');
    
    particleCountSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        particleCountValue.textContent = value;
        if (particleSphere && typeof particleSphere.setParticleCount === 'function') {
            particleSphere.setParticleCount(value);
        }
    });
}



/**
 * Setup morphing controls
 */
function setupMorphingControls() {
    // Scatter slider
    const scatterSlider = document.getElementById('scatterSlider');
    const scatterValue = document.getElementById('scatterValue');
    
    scatterSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        scatterValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setScatterValue === 'function') {
            particleSphere.setScatterValue(value);
        }
    });
    
    // Cluster slider
    const clusterSlider = document.getElementById('clusterSlider');
    const clusterValue = document.getElementById('clusterValue');
    
    clusterSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        clusterValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setClusterValue === 'function') {
            particleSphere.setClusterValue(value);
        }
    });
}


function bindSlider(sliderId, valueId, decimals, setter) {
    const slider = document.getElementById(sliderId);
    const valueEl = document.getElementById(valueId);
    if (!slider || !valueEl) return;
    slider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        valueEl.textContent = v.toFixed(decimals);
        setter(v);
    });
}


/**
 * Update slider values and display values
 */
function updateSliderValues(properties) {
    // Material properties removed from UI but shader effects remain active
}

/**
 * Start FPS counter
 */
function startFpsCounter() {
    const fpsValue = document.getElementById('fpsValue');
    
    function updateFPS() {
        fpsCounter++;
        const currentTime = performance.now();
        
        if (currentTime - lastFpsTime >= 1000) {
            const fps = Math.round((fpsCounter * 1000) / (currentTime - lastFpsTime));
            if (fpsValue) {
                fpsValue.textContent = fps;
            }
            fpsCounter = 0;
            lastFpsTime = currentTime;
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    updateFPS();
}



/**
 * Handle window resize
 */
function onWindowResize() {
    if (particleSphere) {
        particleSphere.onWindowResize();
    }
}

/**
 * Clean up resources when the page is unloaded
 */
function cleanup() {
    if (particleSphere) {
        particleSphere.dispose();
    }
}

// Initialize when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Clean up on page unload
window.addEventListener('beforeunload', cleanup);
