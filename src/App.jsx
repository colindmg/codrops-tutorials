import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Carousel from "./components/Carousel";
import images from "./data/images";

export default function App() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [appActivePlane, setAppActivePlane] = useState(null);

  return (
    <div
      className="relative w-screen h-screen bg-neutral-900 overflow-hidden"
      style={{
        backgroundImage: "url('/img/backgroundgrid.svg')",
        backgroundSize: "cover",
        backgroundImagePosition: "center",
      }}
    >
      <Canvas>
        <Suspense fallback={null}>
          <Carousel
            setHoveredItem={setHoveredItem}
            setAppActivePlane={setAppActivePlane}
          />
        </Suspense>
      </Canvas>

      {/* HTML */}
      <h1
        className="text-4xl font-mono italic tracking-wide font-bold absolute top-28 left-1/2 -translate-x-1/2 text-gray-100 transition-opacity duration-300"
        style={{ opacity: appActivePlane !== null ? 0 : 100 }}
      >
        Brands.
      </h1>
      <div
        className={`absolute top-0 left-0 w-full h-full backdrop-blur-3xl pointer-events-none transition-all duration-1000 flex items-center justify-center ${
          appActivePlane !== null ? "delay-[1s]" : ""
        } `}
        style={{
          backdropFilter: appActivePlane !== null ? "blur(50px)" : "blur(0px)",
        }}
      >
        <h2
          className={`text-gray-100 font-mono font-medium text-4xl transition-opacity duration-300 ${
            appActivePlane !== null ? "delay-700" : ""
          }`}
          style={{
            opacity: appActivePlane !== null ? 100 : 0,
          }}
        >
          {images[appActivePlane]?.name}
        </h2>
      </div>
      <h2
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-2xl font-medium font-mono tracking-wider text-gray-100 transition-opacity duration-300 delay-150"
        style={{ opacity: appActivePlane !== null ? 0 : 100 }}
      >
        {hoveredItem?.name}
      </h2>
    </div>
  );
}
