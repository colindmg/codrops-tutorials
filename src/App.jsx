import Raymarch from "./components/Raymarch";
import WebGPUCanvas from "./components/WebGPUCanvas";

function App() {
  return (
    <>
      <WebGPUCanvas style={{ width: "100vw", height: "100vh" }}>
        <Raymarch />
      </WebGPUCanvas>
    </>
  );
}

export default App;
