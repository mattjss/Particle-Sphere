# Galaxy Shader Orbs

A Three.js web application that creates interactive 3D shader orbs with metallic materials. Hundreds of small sphere particles morph between cluster and scatter states and react to mouse interaction.

## Features

### 🎯 Core Features
- **Galaxy Shader Orbs**: Hundreds of small sphere particles arranged on a spherical surface with metallic shader materials
- **Real-time Morphing**: Smooth interpolation between tight spherical cluster and scattered cloud
- **Automatic Rotation**: The particle cluster rotates in 3D space automatically
- **Mouse Interaction**: Particles react to cursor proximity with repulsion and visual effects
- **Responsive Design**: Adapts to window resizing

### 🎮 Interactive Controls
- **Morph Slider**: Control the transition between tight sphere (0) and scattered cloud (1)
- **Rotation Speed**: Adjust the automatic rotation speed
- **Interaction Settings**: Customize mouse interaction radius and strength
- **Particle System**: Modify particle count and system parameters
- **Preset Buttons**: Quick access to common morph states

### 🎨 Visual Effects
- **Particle Glow**: Particles emit light and pulse when interacting
- **Smooth Animations**: Fluid transitions between states
- **Dynamic Lighting**: Ambient, directional, and point lighting
- **Modern UI**: Clean control panel with Tweakpane

## How to Use

### Getting Started
1. Open `index.html` in a modern web browser
2. The application will automatically initialize and display the particle sphere
3. Use the control panel on the right to adjust parameters
4. Move your mouse to interact with the particles

### Controls Explained

#### Morph State (Main Feature)
- **0**: Tight spherical cluster - particles form a compact globe
- **1**: Scattered cloud - particles spread out randomly
- **0.5**: Half-morphed state - intermediate between the two extremes

#### Animation Controls
- **Rotation Speed**: Controls how fast the particle cluster rotates
- **Mouse Interaction**: Particles react when your cursor gets close

#### Interaction Settings
- **Interaction Radius**: How far the mouse influence extends
- **Interaction Strength**: How strongly particles are repelled

#### Particle System
- **Particle Count**: Number of particles (100-1000)
- **Particle Size**: Size of individual particles
- **Sphere Radius**: Radius of the tight sphere formation
- **Scatter Radius**: Maximum radius for scattered particles

### Mouse Interaction
- Move your mouse near the particles to see them react
- Particles will scatter away from your cursor
- They'll pulse and glow when interacting
- Particles return to their original positions when you move away

## Technical Details

### Architecture
- **ParticleSphere.js**: Main class handling the 3D particle system
- **main.js**: Application initialization and UI controls
- **index.html**: HTML structure and styling

### Key Technologies
- **Three.js**: 3D graphics and rendering
- **Tweakpane**: UI control panel
- **OrbitControls**: Camera manipulation
- **Raycaster**: Mouse interaction detection

### Performance Features
- **Efficient Rendering**: Optimized particle system
- **Smooth Interpolation**: Real-time morphing between states
- **Responsive Design**: Adapts to different screen sizes
- **FPS Monitor**: Real-time performance tracking

## File Structure
```
Galaxy Shader Orbs/
├── index.html          # Main HTML file
├── js/
│   ├── AdvancedParticleSphere.js  # Core particle system with shader orbs
│   ├── ParticleSphere.js         # Legacy particle system class
│   └── main.js                   # Application initialization
└── README.md           # This file
```

## Browser Compatibility
- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled

## Performance Notes
- Recommended: 500 particles for smooth performance
- Higher particle counts may affect frame rate
- GPU acceleration recommended for best experience

## Customization
The code is well-commented and modular, making it easy to:
- Modify particle appearance and behavior
- Add new morph states
- Change lighting and materials
- Extend interaction effects

## Troubleshooting
- If the application doesn't load, check browser console for errors
- Ensure WebGL is supported and enabled
- Try refreshing the page if controls don't respond
- Lower particle count if experiencing performance issues

## Credits
- Built with Three.js for 3D graphics
- UI controls powered by Tweakpane
- Inspired by Perplexity AI Voice Mode visualizations
