import { useThree } from "@react-three/fiber";
import backgroundFragmentShader from "../shaders/fragment.glsl";
import backgroundVertexShader from "../shaders/vertex.glsl";

const Scene = () => {
  const { viewport } = useThree();
  return (
    <>
      {/* PLANE FILLING THE VIEWPORT */}
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          vertexShader={backgroundVertexShader}
          fragmentShader={backgroundFragmentShader}
        />
      </mesh>
    </>
  );
};

export default Scene;
