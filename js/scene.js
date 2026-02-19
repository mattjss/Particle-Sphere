/**
 * scene.js — Three.js scene, camera, renderer, composer
 */
const Scene = {
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    clock: null,

    init(container) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.set(0, 0, 600);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.scene.add(Particles.init());

        if (typeof THREE.EffectComposer !== 'undefined') {
            this.composer = new THREE.EffectComposer(this.renderer);
            this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
            if (typeof THREE.UnrealBloomPass !== 'undefined') {
                this.bloomPass = new THREE.UnrealBloomPass(
                    new THREE.Vector2(window.innerWidth, window.innerHeight),
                    1.4, 0.5, 0.05
                );
                this.composer.addPass(this.bloomPass);
            }
        }
    },

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        Particles.getUniforms().uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    },

    render() {
        const t = this.clock.getElapsedTime();
        Particles.updateTime(t);

        const angle = t * 0.0003 * 60;
        this.camera.position.x = Math.sin(angle) * 600;
        this.camera.position.z = Math.cos(angle) * 600;
        this.camera.lookAt(0, 0, 0);
        this.camera.updateMatrixWorld();

        if (this.composer) this.composer.render();
        else this.renderer.render(this.scene, this.camera);
    }
};
