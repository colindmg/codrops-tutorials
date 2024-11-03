uniform vec2 uResolution;
uniform float uGridSize;
uniform float uRadius;
uniform sampler2D uMouseTrail;
uniform float uTime;

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
  float aspect = uResolution.x / uResolution.y;
  vec2 screenUv = gl_FragCoord.xy / uResolution;
  vec2 uv = coverUv(screenUv);

  // Create a grid
  vec2 gridUv = fract(uv * uGridSize);
  vec2 gridUvCenter = (floor(uv * uGridSize) + 0.5) / uGridSize;

  // Calculate distance from the center of each cell
  float baseDot = sdfCircle(gridUv, uRadius);

  // Sample mouse trail
  float trail = texture2D(uMouseTrail, gridUvCenter).r;

  // Mask gradient
  float circleMaskCenter = length(uv - vec2(0.70, 1.0));
  float circleMask = smoothstep(0.4, 1.0, circleMaskCenter);
  float circleAnimatedMask = sin(uTime * 2.0 + circleMaskCenter * 10.0);

  float screenMask = smoothstep(0.0, 1.0, 1.0 - uv.y);

  // Blend
  float combinedMask = screenMask * circleMask;

  gl_FragColor = vec4(vec3(combinedMask), 1.0);
}