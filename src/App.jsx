import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CarouselItem from "./components/CarouselItem";

export default function App() {
  return (
    <div className="w-screen h-screen bg-gray-100">
      <Canvas>
        <Suspense fallback={null}>
          <CarouselItem />
        </Suspense>
      </Canvas>
    </div>
  );
}
