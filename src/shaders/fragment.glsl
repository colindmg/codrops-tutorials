varying vec2 vUv;

void main() {

    vec2 gridUv = fract(vUv * 100.0);

    gl_FragColor = vec4(gridUv.x, gridUv.y, 0.0, 1.0);
}