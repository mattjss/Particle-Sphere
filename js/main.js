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
    
    // Hide loading message
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Get the container element
    const container = document.getElementById('container');
    if (!container) {
        console.error('Container element not found!');
        return;
    }
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded!');
        return;
    }
    
    // Create the advanced particle sphere visualizer
    try {
        particleSphere = new AdvancedParticleSphere(container);
        console.log('AdvancedParticleSphere created successfully');
    } catch (error) {
        console.error('Error creating AdvancedParticleSphere:', error);
        return;
    }
    
    // Setup the control panel
    setupControlPanel();
    
    // Start FPS counter
    startFpsCounter();
    
    console.log('Advanced 3D Particle Sphere Visualizer initialized successfully!');
}

/**
 * Shared-element transition: panel grows from CTA and collapses back.
 */
const PANEL_SHELL_DURATION_MS = 320;
const PANEL_CONTENT_FADEOUT_MS = 140;
const PANEL_WIDTH = 340;
const PANEL_HEIGHT_FOR_SCALE = 400;

let lastButtonRect = null;

function setupControlPanel() {
    const controlPanelContainer = document.querySelector('.control-panel-container');
    const controlPanelCta = document.getElementById('controlPanelCta');
    const controlPanelShell = document.getElementById('controlPanelShell');
    const controlPanel = document.getElementById('controlPanel');
    const closeButton = document.getElementById('closeControlPanel');
    const backdrop = document.getElementById('controlPanelBackdrop');
    let ctaRevealTimer = null;
    
    function openPanel() {
        if (ctaRevealTimer) {
            clearTimeout(ctaRevealTimer);
            ctaRevealTimer = null;
        }
        const rect = controlPanelCta.getBoundingClientRect();
        lastButtonRect = { width: rect.width, height: rect.height };
        const scaleX = rect.width / PANEL_WIDTH;
        const scaleY = rect.height / PANEL_HEIGHT_FOR_SCALE;
        
        // CTA fades out and scales down so it "hands off" to the panel
        controlPanelCta.classList.add('panel-opening');
        controlPanelCta.style.pointerEvents = 'none';
        
        // Expand container and show backdrop so layout is ready
        if (controlPanelContainer) controlPanelContainer.classList.add('panel-expanded');
        document.body.classList.add('panel-open');
        backdrop.classList.add('visible');
        
        // Shell starts visible at CTA size (same spot, top-right), then will grow
        controlPanelShell.setAttribute('aria-hidden', 'false');
        controlPanelShell.removeAttribute('inert');
        controlPanelShell.classList.add('panel-revealing');
        controlPanelShell.style.transform = `scale(${scaleX}, ${scaleY})`;
        controlPanelShell.style.opacity = '1';
        controlPanelShell.style.pointerEvents = 'none';
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Animate shell from CTA size to full size (opacity stays 1)
                controlPanelShell.classList.remove('panel-revealing');
                controlPanelShell.classList.add('open');
                controlPanelShell.style.transform = '';
                controlPanelShell.style.opacity = '';
                controlPanelShell.style.pointerEvents = '';
                requestAnimationFrame(() => {
                    document.body.classList.add('panel-focused');
                });
                setTimeout(() => {
                    controlPanelCta.style.visibility = 'hidden';
                }, 180);
            });
        });
    }
    
    function closePanel() {
        if (!controlPanelShell.classList.contains('open')) return;
        
        controlPanelShell.classList.add('closing', 'panel-collapsing');
        
        setTimeout(() => {
            const scaleX = lastButtonRect ? lastButtonRect.width / PANEL_WIDTH : 0.2;
            const scaleY = lastButtonRect ? lastButtonRect.height / PANEL_HEIGHT_FOR_SCALE : 0.1;
            
            // Shrink panel into CTA size (opacity stays 1 so it feels like it becomes the button)
            controlPanelShell.style.transform = `scale(${scaleX}, ${scaleY})`;
            controlPanelShell.classList.remove('open');
            controlPanelShell.setAttribute('inert', '');
            document.body.classList.remove('panel-focused');
            
            const onTransitionEnd = (e) => {
                if (e.propertyName !== 'transform') return;
                controlPanelShell.removeEventListener('transitionend', onTransitionEnd);
                controlPanelShell.classList.remove('closing', 'panel-collapsing');
                controlPanelShell.style.transform = '';
                controlPanelShell.style.opacity = '';
                controlPanelShell.setAttribute('aria-hidden', 'true');
                if (controlPanelContainer) controlPanelContainer.classList.remove('panel-expanded');
                document.body.classList.remove('panel-open');
                backdrop.classList.remove('visible');
                
                // Reveal CTA where the panel just shrank to
                controlPanelCta.style.visibility = '';
                controlPanelCta.style.pointerEvents = '';
                controlPanelCta.classList.remove('panel-opening');
                controlPanelCta.classList.add('animating-in');
                requestAnimationFrame(() => {
                    controlPanelCta.classList.add('visible');
                });
                setTimeout(() => {
                    controlPanelCta.classList.remove('animating-in', 'visible');
                }, PANEL_SHELL_DURATION_MS);
            };
            
            controlPanelShell.addEventListener('transitionend', onTransitionEnd);
        }, PANEL_CONTENT_FADEOUT_MS);
    }
    
    if (controlPanelCta) {
        controlPanelCta.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            try {
                openPanel();
            } catch (err) {
                console.error('Control panel open failed:', err);
                controlPanelShell.classList.add('open');
                if (controlPanelContainer) controlPanelContainer.classList.add('panel-expanded');
                backdrop.classList.add('visible');
            }
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closePanel();
        });
    }
    
    if (backdrop) backdrop.addEventListener('click', () => closePanel());
    
    document.addEventListener('click', (event) => {
        if (controlPanelShell.classList.contains('open') &&
            !controlPanelShell.contains(event.target) &&
            !controlPanelCta.contains(event.target)) {
            closePanel();
        }
    });
    
    setupParticleControls();
    setupMorphingControls();
    setupBreathingGalaxyControls();
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
 * Setup Effect mode (tiles) and Breathing Galaxy controls
 */
function setupBreathingGalaxyControls() {
    const modeTiles = document.querySelectorAll('.mode-tile');
    const breathingGalaxyGroup = document.getElementById('breathingGalaxyGroup');
    
    function setModeVisibility(mode) {
        if (breathingGalaxyGroup) {
            breathingGalaxyGroup.classList.toggle('visible', mode === 'breathingGalaxy');
        }
    }
    
    function setActiveTile(mode) {
        modeTiles.forEach((tile) => {
            tile.classList.toggle('active', tile.dataset.mode === mode);
        });
    }
    
    modeTiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            const mode = tile.dataset.mode;
            setActiveTile(mode);
            setModeVisibility(mode);
            if (particleSphere && particleSphere.setMode) particleSphere.setMode(mode);
        });
    });
    
    setActiveTile('default');
    setModeVisibility('default');
    
    // Breathing Galaxy sliders and toggles
    const bindSlider = (sliderId, valueId, decimals, paramKey) => {
        const slider = document.getElementById(sliderId);
        const valueEl = document.getElementById(valueId);
        if (!slider || !valueEl) return;
        slider.addEventListener('input', () => {
            const v = parseFloat(slider.value);
            valueEl.textContent = v.toFixed(decimals);
            if (particleSphere && particleSphere.setBreathingGalaxyParam) {
                particleSphere.setBreathingGalaxyParam(paramKey, v);
            }
        });
    };
    
    bindSlider('breathAmpSlider', 'breathAmpValue', 2, 'breathAmp');
    bindSlider('breathSpeedSlider', 'breathSpeedValue', 2, 'breathSpeed');
    bindSlider('orbitSpeedSlider', 'orbitSpeedValue', 2, 'orbitSpeed');
    bindSlider('noiseAmpSlider', 'noiseAmpValue', 2, 'noiseAmp');
    bindSlider('noiseScaleSlider', 'noiseScaleValue', 2, 'noiseScale');
    bindSlider('noiseSpeedSlider', 'noiseSpeedValue', 2, 'noiseSpeed');
    bindSlider('energySlider', 'energyValue', 2, 'energy');
    bindSlider('mouseHaloRadiusSlider', 'mouseHaloRadiusValue', 2, 'mouseHaloRadius');
    bindSlider('mouseHaloStrengthSlider', 'mouseHaloStrengthValue', 2, 'mouseHaloStrength');
    
    const breathCheck = document.getElementById('breathEnabledCheck');
    const orbitCheck = document.getElementById('orbitEnabledCheck');
    const noiseCheck = document.getElementById('noiseEnabledCheck');
    if (breathCheck) breathCheck.addEventListener('change', () => {
        if (particleSphere && particleSphere.setBreathingGalaxyParam) particleSphere.setBreathingGalaxyParam('breathEnabled', breathCheck.checked);
    });
    if (orbitCheck) orbitCheck.addEventListener('change', () => {
        if (particleSphere && particleSphere.setBreathingGalaxyParam) particleSphere.setBreathingGalaxyParam('orbitEnabled', orbitCheck.checked);
    });
    if (noiseCheck) noiseCheck.addEventListener('change', () => {
        if (particleSphere && particleSphere.setBreathingGalaxyParam) particleSphere.setBreathingGalaxyParam('noiseEnabled', noiseCheck.checked);
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
