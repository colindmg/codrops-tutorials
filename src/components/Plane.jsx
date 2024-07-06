/* eslint-disable react/no-unknown-property */
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";

const Plane = () => {
  const $mesh = useRef();
  const { viewport } = useThree();
  const tex = useTexture(
    "https://raw.githubusercontent.com/supahfunk/webgl-carousel/main/public/img/1.jpg"
  );

  const { width, height } = useControls({
    width: {
      value: 2,
      min: 0.5,
      max: viewport.width,
    },
    height: {
      value: 3,
      min: 0.5,
      max: viewport.height,
    },
  });

  useEffect(() => {
    if ($mesh.current.material) {
      $mesh.current.material.uniforms.uRes.value.x = width;
      $mesh.current.material.uniforms.uRes.value.y = height;
    }
  }, [viewport, width, height]);

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTex: { value: tex },
        uRes: { value: { x: 1, y: 1 } },
        uImageRes: {
          value: { x: tex.source.data.width, y: tex.source.data.height },
        },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }
      `,
      fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      uniform vec2 uRes;
      uniform vec2 uImageRes;

      /*------------------------------
      Background Cover UV
      --------------------------------
      u = basic UV
      s = screensize
      i = image size
      ------------------------------*/
      vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
        float rs = s.x / s.y; // Aspect screen size
        float ri = i.x / i.y; // Aspect image size
        vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
        vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
        return u * s / st + o;
      }

      varying vec2 vUv;
        void main() {
          vec2 uv = CoverUV(vUv, uRes, uImageRes);
          vec3 tex = texture2D(uTex, uv).rgb;
          gl_FragColor = vec4( tex, 1.0 );
        }
      `,
    }),
    [tex]
  );

  return (
    <mesh ref={$mesh}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

export default Plane;
