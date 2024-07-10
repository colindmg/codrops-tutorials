import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Carousel from "./components/Carousel";

export default function App() {
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    console.log(hoveredItem);
  }, [hoveredItem]);

  return (
    <div className="relative w-screen h-screen bg-neutral-900 overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <Carousel setHoveredItem={setHoveredItem} />
        </Suspense>
      </Canvas>

      {/* <div className="absolute top-0 left-0 w-full h-full backdrop-blur-3xl"></div> */}
      <h1 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl font-medium tracking-wider text-gray-100">
        {hoveredItem?.name}
      </h1>
    </div>
  );
}
