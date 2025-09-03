import Webcam from "react-webcam"
import WebCam from "./WebCam.jsx"


function App() {

  return (
    <>
      <div>
      <div className="bg-sky-500">
        <p>Testing</p>
        {/* <Webcam mirrored="true"/> */}
        <WebCam></WebCam>
      </div>
      </div>
    </>
  )
}

export default App