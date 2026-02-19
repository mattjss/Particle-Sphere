attribute vec3 aPositionOrigin;
attribute vec3 aPositionTarget;
attribute vec3 aColor;
attribute float aSize;
attribute float aIndex;
attribute float aDelay;
attribute vec3 aScatterOffset;

uniform float uMorphProgress;
uniform float uColorProgress;
uniform float uScatter;
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uMouse;

varying vec3 vColor;

void main() {
    vec3 pos = mix(aPositionOrigin, aPositionTarget,
        smoothstep(aDelay, 1.0, uMorphProgress));

    pos += aScatterOffset * uScatter;

    if (uMorphProgress < 0.15) {
        vec2 mouseWorld = (uMouse * 2.0 - 1.0) * 400.0;
        vec2 toMouse = pos.xy - mouseWorld;
        float dist = length(toMouse);
        float repel = smoothstep(80.0, 0.0, dist) * 35.0;
        pos.xy += normalize(toMouse) * repel;
    }

    if (uMorphProgress < 0.02) {
        pos.x += sin(uTime * 0.1 + aIndex * 1.3) * 0.3;
        pos.y += sin(uTime * 0.1 + aIndex * 1.3 + 2.1) * 0.3;
        pos.z += sin(uTime * 0.1 + aIndex * 1.3 + 4.2) * 0.3;
    }

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float shimmer = sin(uTime * 2.0 + aIndex * 0.5) * 0.3 + 0.7;
    gl_PointSize = aSize * shimmer * uPixelRatio;

    vColor = mix(vec3(0.85, 0.9, 1.0), aColor, uColorProgress);
}
