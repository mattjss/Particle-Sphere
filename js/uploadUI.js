/**
 * uploadUI.js — file input, thumbnail, button states
 */
const UploadUI = {
    container: null,
    btn: null,
    fileInput: null,
    previewWrap: null,
    hasImage: false,

    init() {
        const wrap = document.createElement('div');
        wrap.className = 'upload-ui';
        wrap.innerHTML = `
            <div class="upload-preview" id="uploadPreview">
                <img class="preview-thumb" id="previewThumb" alt="">
                <span class="preview-filename" id="previewFilename"></span>
                <a class="preview-clear" id="previewClear">✕ Clear</a>
            </div>
            <button class="upload-btn" id="uploadBtn">↑ Upload Image</button>
            <input type="file" id="fileInput" accept="image/*" hidden>
        `;
        document.body.appendChild(wrap);

        this.container = wrap;
        this.btn = document.getElementById('uploadBtn');
        this.fileInput = document.getElementById('fileInput');
        this.previewWrap = document.getElementById('uploadPreview');
        this.previewThumb = document.getElementById('previewThumb');
        this.previewFilename = document.getElementById('previewFilename');

        this.btn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.onFileSelect(e));
        document.getElementById('previewClear').addEventListener('click', (e) => {
            e.preventDefault();
            this.clear();
        });

        this.previewWrap.style.display = 'none';
    },

    onFileSelect(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const { positions, colors } = MorphEngine.sampleImage(img);
                MorphEngine.morphToImage(positions, colors);

                this.showPreview(ev.target.result, file.name);
                this.btn.textContent = '↺ New Image';
                anime({ targets: this.btn, scale: [1, 1.05, 1], duration: 300 });
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    },

    showPreview(dataUrl, filename) {
        this.hasImage = true;
        this.previewThumb.src = dataUrl;
        this.previewFilename.textContent = filename.length > 20 ? filename.slice(0, 17) + '...' : filename;

        this.previewWrap.style.display = 'flex';
        this.previewWrap.style.opacity = '0';
        this.previewWrap.style.transform = 'translateY(10px)';
        anime({
            targets: this.previewWrap,
            opacity: 1,
            translateY: 0,
            duration: 320,
            easing: 'easeOutExpo'
        });
    },

    clear() {
        MorphEngine.reset();
        this.hasImage = false;
        this.previewWrap.style.display = 'none';
        this.btn.textContent = '↑ Upload Image';
        this.fileInput.value = '';
    }
};
