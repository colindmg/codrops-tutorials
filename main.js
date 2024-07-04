import * as THREE from "three";

const scene = new THREE.Scene();

let width = window.innerWidth;
let height = window.innerHeight;

const aspect = width / height;
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.getElementById("scene").appendChild(renderer.domElement);

const geo = new THREE.PlaneGeometry(1, 1);
const mat = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
    varying vec2 v_texcoord;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        v_texcoord = uv;
    }`,
  fragmentShader: /* glsl */ `
    varying vec2 v_texcoord;
    void main() {
      vec2 st = v_texcoord;
      vec3 color = vec3(st.x, st.y, 1.0);
      gl_FragColor = vec4(color.rgb, 1.0);
    }`,
});
const quad = new THREE.Mesh(geo, mat);
scene.add(quad);

camera.position.z = 1; // Set appropriately for orthographic

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
