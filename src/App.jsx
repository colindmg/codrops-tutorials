import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

function App() {
  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <Scene />
      </Canvas>
    </>
  );
}

export default App;
