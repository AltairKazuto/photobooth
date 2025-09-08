import Webcam from "react-webcam"
import WebCam from "./WebCam.jsx"
import React, {useEffect, useState, useRef, memo} from "react";
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
  const [buttonAnimating, setButtonAnimating] = useState([0, 0, 0, 0, 0, 0]);
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

  const buttonAnimation = (index, type) => {
    console.log('in')
    const nextButtonAnimating = buttonAnimating.map((b, i) => {
      if(i == index) {
        return type;
      }
      return 0;
    })
    setButtonAnimating(nextButtonAnimating)
  }

 const MyButton = memo(() => {
    const [buttonAnimating, setButtonAnimating] = useState(0);
    const buttonAnimation = (type) => {
      setButtonAnimating(type)
    }

    return (
        <div>
          <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating == 1 ? 'mt-[var(--hover-button)]': buttonAnimating == 2 ? 'mt-[var(--click-button)]': ''}`}
                  onMouseOver={() => buttonAnimation(1)}
                  // onMouseUp={() => buttonAnimation(1)}
                  // onMouseOut={() => buttonAnimation(0)}
                  // onMouseDown={() => buttonAnimation(2)}
                  onClick={()=> {setFilter('Normal')}}>Normal</button>
          <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
        </div>
    )
  })


  return (
    <>
      <div>
      <div className="flex bg-red-100 mt-10">
        <div className={"flex-2/3"}>
          <div className={"flex justify-center"}>
            <div className={" bg-white"}>
              <div className={"relative border-10 border-gray-200"}>
                <div className={`absolute z-50 inset-0 bg-white transition-opacity ${flash ? "opacity-80" : "opacity-0"} duration-300`}></div>
                <p className={`absolute z-20 ${!innerTimer ? "hidden" : ""} text-stone-50 outline-black shadow-2xl font-bold text-4xl`}>{innerTimer}</p>
                <WebCam filter={filter} onProcessed={(pic) => setLatestProcessed(pic)}></WebCam>
              </div>
              <div className={"text-right"}>
                <label> Timer Countdown: </label>
                <select onChange={changeTimer} disabled={isCapturing}>
                  <option value="3">3 secs</option>
                  <option value="5">5 secs</option>
                  <option value="10">10 secs</option>
                </select>
              </div>
              <div className={"flex w-full h-20"}>
                <div className={"relative flex-auto w-20 flex justify-center"}>
                  <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating[0] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[0] == 2 ? 'mt-[var(--click-button)]': ''}`}
                          onMouseOver={() => buttonAnimation(0, 1)}
                          onMouseUp={() => buttonAnimation(0, 1)}
                          onMouseOut={() => buttonAnimation(0, 0)}
                          onMouseDown={() => buttonAnimation(0, 2)} onClick={()=> {setFilter('Normal')}}>Normal</button>
                  <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
                </div>
                <div className={"relative flex-auto w-20 flex justify-center"}>
                  <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating[1] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[1] == 2 ? 'mt-[var(--click-button)]': ''}`}
                          onMouseOver={() => buttonAnimation(1, 1)}
                          onMouseUp={() => buttonAnimation(1, 1)}
                          onMouseOut={() => buttonAnimation(1, 0)}
                          onMouseDown={() => buttonAnimation(1, 2)} onClick={()=> {setFilter('Old_School')}}>Old School</button>
                  <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
                </div>
                <div className={"relative flex-auto w-20 flex justify-center"}>
                  <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating[2] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[2] == 2 ? 'mt-[var(--click-button)]': ''}`}
                          onMouseOver={() => buttonAnimation(2, 1)}
                          onMouseUp={() => buttonAnimation(2, 1)}
                          onMouseOut={() => buttonAnimation(2, 0)}
                          onMouseDown={() => buttonAnimation(2, 2)} onClick={()=> {setFilter('TV')}}>TV</button>
                  <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
                </div>
                <div className={"relative flex-auto w-20 flex justify-center"}>
                  <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating[3] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[3] == 2 ? 'mt-[var(--click-button)]': ''}`}
                          onMouseOver={() => buttonAnimation(3, 1)}
                          onMouseUp={() => buttonAnimation(3, 1)}
                          onMouseOut={() => buttonAnimation(3, 0)}
                          onMouseDown={() => buttonAnimation(3, 2)} onClick={()=> {setFilter('Pop_Art')}}>Pop Art</button>
                  <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
                </div>
                <div className={"relative flex-auto w-20 flex justify-center"}>
                  <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating[4] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[4] == 2 ? 'mt-[var(--click-button)]': ''}`}
                          onMouseOver={() => buttonAnimation(4, 1)}
                          onMouseUp={() => buttonAnimation(4, 1)}
                          onMouseOut={() => buttonAnimation(4, 0)}
                          onMouseDown={() => buttonAnimation(4, 2)} onClick={()=> {setFilter('VHS')}}>VHS</button>
                  <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
                </div>
                <div className={"relative flex-auto w-20 flex justify-center"}>
                  <button className={`absolute bg-red-200 w-20 h-18 rounded-lg z-1 transition-all duration-100 ease-in-out ${buttonAnimating[5] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[5] == 2 ? 'mt-[var(--click-button)]': ''}`}
                          onMouseOver={() => buttonAnimation(5, 1)}
                          onMouseUp={() => buttonAnimation(5, 1)}
                          onMouseOut={() => buttonAnimation(5, 0)}
                          onMouseDown={() => buttonAnimation(5, 2)} onClick={()=> {setFilter('Neon')}}>Neon</button>
                  <div className={"absolute bg-blue-200 w-20 h-18 rounded-lg mt-3"}></div>
                </div>
                <button className={"w-10 bg-black flex-auto"} onClick={() => {handleExport()}}>Export as PNG</button>
              </div>

              {/*<MyButton></MyButton>*/}
              {/*<button onClick={()=> {setFilter('Old_School')}}>Old School</button>*/}
              {/*<button onClick={()=> {setFilter('TV')}}>TV</button>*/}
              {/*<button onClick={()=> {setFilter('Pop_Art')}}>Pop Art</button>*/}
              {/*<button onClick={()=> {setFilter('VHS')}}>VHS</button>*/}
              {/*<button onClick={()=> {setFilter('Neon')}}>Neon</button>*/}
              <div className={"flex justify-center mt-5"}>
                <button className={"bg-red-400 w-1/2 rounded-lg"} onClick={() => {startCapture()}} disabled={isCapturing}>Capture</button>
              </div>


            </div>
        </div>




        </div>   
        <Picture list={pictures} state={filter} ref={componentRef} frame={currentFrame}/>
        {/* Ikaw na bahala dito AHAHA (filters), I recommend na ung frames na gagamitin is import dito para masama siya export on*/}
        <button onClick={() => {setCurrentFrame("bg-slate-300")}}>Frame1</button>
        <button onClick={() => {setCurrentFrame("bg-[url(https://d7hftxdivxxvm.cloudfront.net/?height=630&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2F2P6t_Yt6dF0TNN76dlp-_Q%252F3417757448_4a6bdf36ce_o.jpg&width=1200)]")}}>Frame2</button>
        <button onClick={() => {setCurrentFrame("bg-[url(https://i.pinimg.com/736x/cf/5e/27/cf5e272e452b9c7caa8fa0523eeeba9f.jpg)] bg-repeat")}}>Frame3</button>
      </div>
      </div>
    </>
  )
}

export default App