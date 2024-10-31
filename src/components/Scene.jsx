import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector2 } from "three";
import backgroundFragmentShader from "../shaders/fragment.glsl";
import backgroundVertexShader from "../shaders/vertex.glsl";

const Scene = () => {
  const { viewport, size } = useThree();
  const backgroundMeshRef = useRef();
  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <>
      {/* PLANE FILLING THE VIEWPORT */}
      <mesh ref={backgroundMeshRef} scale={[scale, scale, 1]}>
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
          }}
        />
      </mesh>
    </>
  );
};

export default Scene;
