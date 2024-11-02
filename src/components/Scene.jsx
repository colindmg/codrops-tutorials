import { useTrailTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector2 } from "three";
import backgroundFragmentShader from "../shaders/fragment.glsl";
import backgroundVertexShader from "../shaders/vertex.glsl";

const Scene = () => {
  const { viewport, size } = useThree();
  const backgroundMeshRef = useRef();
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

  return (
    <>
      {/* PLANE FILLING THE VIEWPORT */}
      <mesh
        ref={backgroundMeshRef}
        scale={[scale, scale, 1]}
        onPointerMove={onMove}
      >
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={backgroundVertexShader}
          fragmentShader={backgroundFragmentShader}
          uniforms={{
            uResolution: {
              value: new Vector2(
                size.width * viewport.dpr,
                size.height * viewport.dpr
              ),
            },
            uGridSize: { value: 50 },
            uRadius: { value: 0.3 },
            uMouseTrail: { value: trail },
          }}
        />
      </mesh>
    </>
  );
};

export default Scene;
