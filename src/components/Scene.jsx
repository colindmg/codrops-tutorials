import { shaderMaterial, useTrailTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import backgroundFragmentShader from "../shaders/fragment.glsl";
import backgroundVertexShader from "../shaders/vertex.glsl";

const DotMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouseTrail: null,
    uGridSize: 50,
    uRadius: 0.3,
  },
  backgroundVertexShader,
  backgroundFragmentShader
);

const Scene = () => {
  const { viewport, size } = useThree();
  const scale = Math.max(viewport.width, viewport.height) / 2;

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 400,
    interpolate: 1,
    ease: function easeInOutCirc(x) {
      return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
  });

  const dotMaterial = useMemo(() => {
    return new DotMaterial();
  }, []);

  useFrame((state, delta) => {
    console.log("delta", delta);
  });

  return (
    <>
      {/* PLANE FILLING THE VIEWPORT */}
      <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
        <planeGeometry args={[2, 2]} />
        {/* <shaderMaterial
          ref={backgroundMeshMaterialRef}
          vertexShader={backgroundVertexShader}
          fragmentShader={backgroundFragmentShader}
          uniforms={{
            uResolution: {
              value: new THREE.Vector2(
                size.width * viewport.dpr,
                size.height * viewport.dpr
              ),
            },
            uGridSize: { value: 50 },
            uRadius: { value: 0.3 },
            uMouseTrail: { value: trail },
            uTime: { value: 0 },
          }}
        /> */}
        <primitive
          object={dotMaterial}
          uResolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
          uGridSize={50}
          uMouseTrail={trail}
        />
      </mesh>
    </>
  );
};

export default Scene;
