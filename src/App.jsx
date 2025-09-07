import Webcam from "react-webcam"
import WebCam from "./WebCam.jsx"
import { useEffect, useState, useRef } from "react";
import Picture from './Picture.jsx';
import { toPng } from "html-to-image";


function App() {

  const [filter, setFilter] = useState('Normal');
  const [pictures, setPictures] = useState([]);
  const [latestProcessed, setLatestProcessed] = useState(null);
  const [counter, setCounter] = useState(4);
  const [isCapturing, setIsCapturing] = useState(false);
  const [innerTimer, setInnerTimer] = useState(0);
  const [flash, setFlash] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(3);
  const componentRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState("bg-slate-300")

  const handleExport = async() => {
    if (componentRef.current) {
      const dataUrl = await toPng(componentRef.current, {
        cacheBust: true,
        width: componentRef.current.scrollWidth,
        height: componentRef.current.scrollHeight
      });
      const link = document.createElement("a");
      link.download = "export.png";
      link.href = dataUrl;
      link.click();
    }
  }

  useEffect(()=> {
    if (isCapturing && counter > 0) {
      const timeout = setTimeout(() => {
        setInnerTimer((time) => time - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsCapturing(false);
      setInnerTimer(0);
    }
  }, [isCapturing, innerTimer]);

  useEffect(() =>{
    if (innerTimer === 0 && isCapturing) {
      
      setCounter((count) => count - 1);
      setFlash(true);
      const timeout = setTimeout(() => {
        setPictures([...pictures, latestProcessed]);
        setInnerTimer(selectedTimer);
        setFlash(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [innerTimer]);


  const startCapture = () => {
    setInnerTimer(selectedTimer);
    setCounter(4);
    setIsCapturing(true);
  }

  const changeTimer = (event) => {
    console.log(event.target.value);
    setSelectedTimer(parseInt(event.target.value, 10));
  }

  return (
    <>
      <div>
      <div className="flex">
        <div>
          <select onChange={changeTimer} disabled={isCapturing}>
            <option value="3">3 secs</option>
            <option value="5">5 secs</option>
            <option value="10">10 secs</option>
          </select>
          <div className="relative">
            <div className={`absolute z-50 inset-0 bg-white transition-opacity ${flash ? "opacity-80" : "opacity-0"} duration-300`}></div>
            <p className={`absolute z-20 ${!innerTimer ? "hidden" : ""} text-stone-50 outline-black shadow-2xl font-bold text-4xl`}>{innerTimer}</p>
            <WebCam filter={filter} onProcessed={(pic) => setLatestProcessed(pic)}></WebCam>
          </div>
          <button onClick={()=> {setFilter('Normal')}}>Normal</button>
          <button onClick={()=> {setFilter('Old_School')}}>Old School</button>
          <button onClick={()=> {setFilter('TV')}}>TV</button>
          <button onClick={()=> {setFilter('Pop_Art')}}>Pop Art</button>
          <button onClick={()=> {setFilter('VHS')}}>VHS</button>
          <button onClick={() => {startCapture()}} disabled={isCapturing}>Capture</button>
          <button onClick={() => {handleExport()}}>Export as PNG</button>
        </div>   
        <Picture list={pictures} state={filter} ref={componentRef} frame={currentFrame}/>
      </div>
      </div>
    </>
  )
}

export default App