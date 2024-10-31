uniform vec2 uResolution;
uniform float uGridSize;

vec2 coverUv(vec2 uv) {
  vec2 s = uResolution.xy / max(uResolution.x, uResolution.y);
  vec2 newUv = (uv - 0.5) * s + 0.5;
  return clamp(newUv, 0.0, 1.0);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / uResolution;
  vec2 uv = coverUv(screenUv);

  // Create a grid
  vec2 gridUv = fract(uv * uGridSize);

  gl_FragColor = vec4(gridUv.x, gridUv.y, 0.0, 1.0);
}