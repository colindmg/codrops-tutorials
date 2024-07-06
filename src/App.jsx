import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Plane from "./components/Plane";

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas>
        <Suspense fallback={null}>
          <Plane />
        </Suspense>
      </Canvas>
    </div>
  );
}
