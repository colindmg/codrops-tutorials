/* eslint-disable react/no-unknown-property */
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { forwardRef } from "react";
import { Color } from "three";

const PostProcessing = forwardRef((_, ref) => {
  const { viewport } = useThree();

  // IF YOU WANT TO DEACTIVATE THE POST PROCESSING EFFECT, SET 'active' TO 'false'
  const active = false;

  return (
    active && (
      <mesh position={[0, 0, 1]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <MeshTransmissionMaterial
          ref={ref}
          background={new Color("white")}
          transmission={0.7}
          roughness={0}
          thickness={0}
          chromaticAberration={0.06}
          anisotropy={0}
          ior={1.1}
        />
      </mesh>
    )
  );
});

PostProcessing.displayName = "PostProcessing";

export default PostProcessing;
