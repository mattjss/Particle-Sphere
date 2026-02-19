/**
 * morphEngine.js — image sampling, Anime.js morph tweens
 */
const MorphEngine = {
    canvas: null,
    ctx: null,

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.ctx = this.canvas.getContext('2d');
    },

    sampleImage(img) {
        if (!this.ctx) this.init();
        const w = 256, h = 256;
        this.ctx.drawImage(img, 0, 0, w, h);
        const data = this.ctx.getImageData(0, 0, w, h);

        const pool = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const r = data.data[i] / 255;
                const g = data.data[i + 1] / 255;
                const b = data.data[i + 2] / 255;
                const brightness = r * 0.299 + g * 0.587 + b * 0.114;
                pool.push({ x, y, r, g, b, brightness });
            }
        }

        const count = 10000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const p = pool[Math.floor(Math.random() * pool.length)];
            const jitter = pool.length < count ? 3 : 0;
            const jx = (Math.random() - 0.5) * jitter * 2;
            const jy = (Math.random() - 0.5) * jitter * 2;
            const jz = (Math.random() - 0.5) * jitter * 2;

            positions[i * 3] = (p.x / 256 - 0.5) * 520 + jx;
            positions[i * 3 + 1] = -(p.y / 256 - 0.5) * 520 + jy;
            positions[i * 3 + 2] = (p.brightness - 0.5) * 100 + jz;

            colors[i * 3] = p.r;
            colors[i * 3 + 1] = p.g;
            colors[i * 3 + 2] = p.b;
        }
        return { positions, colors };
    },

    morphToImage(positions, colors) {
        Particles.setTargets(positions, colors);
        const u = Particles.getUniforms();

        const scatterObj = { s: 0 };
        anime({
            targets: scatterObj,
            s: 1,
            duration: 300,
            easing: 'easeInQuart',
            update: () => { u.uScatter.value = scatterObj.s; },
            complete: () => {
                const m = { v: u.uMorphProgress.value };
                anime({ targets: m, v: 1, duration: 1800, easing: 'easeInOutCubic',
                    update: () => { u.uMorphProgress.value = m.v; } });
                const c = { v: u.uColorProgress.value };
                anime({ targets: c, v: 1, delay: 500, duration: 1000, easing: 'easeOutQuart',
                    update: () => { u.uColorProgress.value = c.v; } });
                anime({
                    targets: scatterObj,
                    s: 0,
                    duration: 1800,
                    easing: 'easeInOutCubic',
                    update: () => { u.uScatter.value = scatterObj.s; }
                });
            }
        });
    },

    reset() {
        const u = Particles.getUniforms();

        const co = { v: u.uColorProgress.value };
        anime({ targets: co, v: 0, duration: 500, easing: 'easeInQuart',
            update: () => { u.uColorProgress.value = co.v; } });

        const morphObj = { v: u.uMorphProgress.value };
        anime({
            targets: morphObj,
            v: 0,
            duration: 1400,
            delay: 200,
            easing: 'easeInOutCubic',
            update: () => { u.uMorphProgress.value = morphObj.v; },
            complete: () => {
                Particles.resetToCloud();
            }
        });
    }
};
