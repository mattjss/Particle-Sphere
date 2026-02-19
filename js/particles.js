/**
 * particles.js — BufferGeometry, ShaderMaterial, attributes
 */
const PARTICLE_COUNT = 10000;
const CLOUD_RADIUS = 400;

const Particles = {
    geometry: null,
    material: null,
    points: null,

    init() {
        const posOrigin = new Float32Array(PARTICLE_COUNT * 3);
        const posTarget = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        const indices = new Float32Array(PARTICLE_COUNT);
        const delays = new Float32Array(PARTICLE_COUNT);
        const scatterOffsets = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = CLOUD_RADIUS * Math.cbrt(Math.random());
            posOrigin[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            posOrigin[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            posOrigin[i * 3 + 2] = r * Math.cos(phi);

            posTarget[i * 3] = posOrigin[i * 3];
            posTarget[i * 3 + 1] = posOrigin[i * 3 + 1];
            posTarget[i * 3 + 2] = posOrigin[i * 3 + 2];

            colors[i * 3] = 0.85;
            colors[i * 3 + 1] = 0.9;
            colors[i * 3 + 2] = 1.0;

            sizes[i] = 1.5 + Math.random() * 2.5;
            indices[i] = i;
            delays[i] = Math.random() * 0.4;

            scatterOffsets[i * 3] = (Math.random() - 0.5) * 80;
            scatterOffsets[i * 3 + 1] = (Math.random() - 0.5) * 80;
            scatterOffsets[i * 3 + 2] = (Math.random() - 0.5) * 80;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('aPositionOrigin', new THREE.BufferAttribute(posOrigin, 3));
        this.geometry.setAttribute('aPositionTarget', new THREE.BufferAttribute(posTarget, 3));
        this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        this.geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1));
        this.geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
        this.geometry.setAttribute('aScatterOffset', new THREE.BufferAttribute(scatterOffsets, 3));

        const uniforms = {
            uMorphProgress: { value: 0 },
            uColorProgress: { value: 0 },
            uScatter: { value: 0 },
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: ShaderLib.vertex,
            fragmentShader: ShaderLib.fragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.frustumCulled = false;
        return this.points;
    },

    getUniforms() { return this.material.uniforms; },

    updateTime(t) { this.material.uniforms.uTime.value = t; },
    updateMouse(x, y) { this.material.uniforms.uMouse.value.set(x, y); },

    setTargets(positions, colors) {
        const posAttr = this.geometry.attributes.aPositionTarget;
        const colAttr = this.geometry.attributes.aColor;
        const n = Math.min(positions.length, posAttr.array.length);
        for (let i = 0; i < n; i++) posAttr.array[i] = positions[i];
        const nc = Math.min(colors.length, colAttr.array.length);
        for (let i = 0; i < nc; i++) colAttr.array[i] = colors[i];
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
    },

    resetToCloud() {
        const origin = this.geometry.attributes.aPositionOrigin.array;
        const target = this.geometry.attributes.aPositionTarget.array;
        const col = this.geometry.attributes.aColor.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            target[i * 3] = origin[i * 3];
            target[i * 3 + 1] = origin[i * 3 + 1];
            target[i * 3 + 2] = origin[i * 3 + 2];
            col[i * 3] = 0.85;
            col[i * 3 + 1] = 0.9;
            col[i * 3 + 2] = 1.0;
        }
        this.geometry.attributes.aPositionTarget.needsUpdate = true;
        this.geometry.attributes.aColor.needsUpdate = true;
    }
};
