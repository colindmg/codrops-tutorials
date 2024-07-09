import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Carousel from "./components/Carousel";

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-gray-100 overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <Carousel />
        </Suspense>
      </Canvas>

      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-3xl"></div>
    </div>
  );
}
