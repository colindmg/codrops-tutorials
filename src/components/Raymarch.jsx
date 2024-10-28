import { useThree } from "@react-three/fiber";

import {
  abs,
  Break,
  cos,
  dot,
  float,
  Fn,
  If,
  Loop,
  max,
  MeshBasicNodeMaterial,
  min,
  mix,
  normalize,
  reflect,
  screenSize,
  sin,
  timerLocal,
  uv,
  vec2,
  vec3,
} from "three/tsl";

const raymarchMaterial = new MeshBasicNodeMaterial();

const sdSphere = Fn(([p, r]) => {
  return p.length().sub(r);
});

const sdBox = Fn(([p, b]) => {
  return p.abs().sub(b).max(0).length();
});

const timer = timerLocal(1);

const smin = Fn(([a, b, k]) => {
  const h = max(k.sub(abs(a.sub(b))), 0).div(k);
  return min(a, b).sub(h.mul(h).mul(k).mul(0.25));
});

const sdf = Fn(([pos]) => {
  const translatedPos = pos.add(
    vec3(
      sin(timer.mul(2)).mul(0.9), // x : mouvement en 8
      sin(timer).mul(0.8), // y : simple oscillation
      sin(timer).mul(cos(timer)) // z : complète le mouvement en 8
    )
  );

  // On peut utiliser différentes vitesses de rotation pour chaque axe
  const angleX = timer;
  const angleY = timer.mul(0.7); // rotation un peu plus lente sur Y
  const angleZ = timer.mul(1.3); // rotation un peu plus rapide sur Z

  // Rotation sur Z d'abord
  const x1 = pos.x.mul(cos(angleZ)).sub(pos.y.mul(sin(angleZ)));
  const y1 = pos.x.mul(sin(angleZ)).add(pos.y.mul(cos(angleZ)));
  const z1 = pos.z;

  // Puis rotation sur Y
  const x2 = x1.mul(cos(angleY)).add(z1.mul(sin(angleY)));
  const y2 = y1;
  const z2 = x1.mul(sin(angleY).negate()).add(z1.mul(cos(angleY)));

  // Enfin rotation sur X
  const x3 = x2;
  const y3 = y2.mul(cos(angleX)).sub(z2.mul(sin(angleX)));
  const z3 = y2.mul(sin(angleX)).add(z2.mul(cos(angleX)));

  const rotatedPos = vec3(x3, y3, z3);
  const sphere = sdSphere(translatedPos, 0.5);
  const box = sdBox(rotatedPos, vec3(0.4));

  return smin(box, sphere, 0.3);
});

const calcNormal = Fn(([p]) => {
  const eps = float(0.0001);
  const h = vec2(eps, 0);
  return normalize(
    vec3(
      sdf(p.add(h.xyy)).sub(sdf(p.sub(h.xyy))),
      sdf(p.add(h.yxy)).sub(sdf(p.sub(h.yxy))),
      sdf(p.add(h.yyx)).sub(sdf(p.sub(h.yyx)))
    )
  );
});

const lighting = Fn(([ro, r]) => {
  const normal = calcNormal(r);
  const viewDir = normalize(ro.sub(r));

  // Step 1: Ambient light
  const ambient = vec3(0.2);

  // Step 2: Diffuse lighting - gives our shape a 3D look by simulating how light reflects in all directions
  const lightDir = normalize(vec3(1, 1, 1));
  const lightColor = vec3(1, 1, 0.9);
  const dp = max(0, dot(lightDir, normal));

  const diffuse = dp.mul(lightColor);

  // Steo 3: Hemisphere light - a mix between a sky and ground colour based on normals
  const skyColor = vec3(0, 0.3, 0.6);
  const groundColor = vec3(0.6, 0.3, 0.1);

  const hemiMix = normal.y.mul(0.5).add(0.5);
  const hemi = mix(groundColor, skyColor, hemiMix);

  // Step 4: Phong specular - Reflective light and highlights
  const ph = normalize(reflect(lightDir.negate(), normal));
  const phongValue = max(0, dot(viewDir, ph)).pow(32);

  const specular = vec3(phongValue).toVar();

  // Step 5: Fresnel effect - makes our specular highlight more pronounced at different viewing angles
  const fresnel = float(1)
    .sub(max(0, dot(viewDir, normal)))
    .pow(2);

  specular.mulAssign(fresnel);

  // Lighting is a mix of ambient, hemi, diffuse, then specular added at the end
  // We're multiplying these all by different values to control their intensity

  // Step 1
  const lighting = ambient.mul(0.1);

  // Step 2
  lighting.addAssign(diffuse.mul(0.5));

  // Step 3
  lighting.addAssign(hemi.mul(0.2));

  const finalColor = vec3(0.1).mul(lighting).toVar();

  // Step 4 & 5
  finalColor.addAssign(specular);

  return finalColor;
});

const raymarch = Fn(() => {
  // Use frag coordinates to get an aspect-fixed UV
  const _uv = uv()
    .mul(screenSize.xy)
    .mul(2)
    .sub(screenSize.xy)
    .div(screenSize.y);

  // Initialize the ray and its direction
  const rayOrigin = vec3(0, 0, -3);
  const rayDirection = vec3(_uv, 1).normalize();

  // Total distance travelled - note that toVar is important here so we can assign to this variable
  const t = float(0).toVar();

  // Calculate the initial position of the ray - this var is declared here so we can use it in lighting calculations later
  const ray = rayOrigin.add(rayDirection.mul(t)).toVar();

  Loop({ start: 1, end: 80 }, () => {
    const d = sdf(ray); // current distance to the scene

    t.addAssign(d.mul(0.8)); // slightly reduce the marching step

    ray.assign(rayOrigin.add(rayDirection.mul(t))); // position along the ray

    // If we're close enough, it's a hit, so we can do an early return
    If(d.lessThan(0.005), () => {
      // increase threshold
      Break();
    });

    // If we've travelled too far, we can return now and consider that this ray didn't hit anything
    If(t.greaterThan(50), () => {
      // reduce maximum distance
      Break();
    });
  });

  return lighting(rayOrigin, ray);
})();

raymarchMaterial.colorNode = raymarch;

const Raymarch = () => {
  const { width, height } = useThree((state) => state.viewport);

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={raymarchMaterial} attach="material" />
    </mesh>
  );
};

export default Raymarch;
