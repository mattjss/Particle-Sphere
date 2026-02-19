/**
 * main.js — init, render loop, resize
 */
function init() {
    const container = document.getElementById('container');
    Scene.init(container);
    UploadUI.init();

    window.addEventListener('resize', () => Scene.resize());

    document.addEventListener('mousemove', (e) => {
        Particles.updateMouse(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    });

    function render() {
        Scene.render();
        requestAnimationFrame(render);
    }
    render();
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
