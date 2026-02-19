varying vec3 vColor;

uniform float uColorProgress;

void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.3, 0.5, d);
    float core = 1.0 - smoothstep(0.0, 0.15, d);
    vec3 color = mix(vec3(0.85, 0.9, 1.0), vColor, uColorProgress);
    gl_FragColor = vec4(color + core * 0.5, alpha * 0.9);
}
