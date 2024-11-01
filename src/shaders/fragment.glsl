uniform vec2 uResolution;
uniform float uGridSize;
uniform float uRadius;

vec2 coverUv(vec2 uv) {
  vec2 s = uResolution.xy / max(uResolution.x, uResolution.y);
  vec2 newUv = (uv - 0.5) * s + 0.5;
  return clamp(newUv, 0.0, 1.0);
}

/* SDF Shapes */
float sdfCircle(vec2 p, float r) {
  return length(p - 0.5) - r;
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / uResolution;
  vec2 uv = coverUv(screenUv);

  // Create a grid
  vec2 gridUv = fract(uv * uGridSize);

  // Calculate distance from the center of each cell
  float baseDot = sdfCircle(gridUv, uRadius);

  gl_FragColor = vec4(vec3(baseDot), 1.0);
}