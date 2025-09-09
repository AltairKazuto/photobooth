import Webcam from "react-webcam"
import WebCam from "./WebCam.jsx"
import React, {useEffect, useState, useRef, memo} from "react";
import Picture from './Picture.jsx';
import background from './icons/photobooth_bg.png';
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
  const componentRef2 = useRef(null);
  const componentRef3 = useRef(null);
  const componentRef4 = useRef(null);
  const componentRef5 = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0)
  const [buttonAnimating, setButtonAnimating] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const refs = [componentRef, componentRef2, componentRef3, componentRef4, componentRef5]

  // Colors
  const buttonColor = " bg-red-400 text-black font-bold text-[20px]";
  const buttonSideColor = " bg-rose-950";

  const handleExport = async() => {
    if (refs[currentFrame].current) {
      const dataUrl = await toPng(refs[currentFrame].current, {
        cacheBust: true,
        width: refs[currentFrame].current.scrollWidth,
        height: refs[currentFrame].current.scrollHeight
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
      <div className={"bg-black"}>
        {/*style={{backgroundImage: `url(${background})`, backgroundSize: 'cover'}}*/}
      <div className="flex bg-white pt-10 pb-15">
        <div className={"flex-2/3"}>
          <div className={"flex justify-center"}>
            <div>
              <div className={"relative border-10 border-black rounded-md"}>
                <div className={`absolute z-50 inset-0 bg-white transition-opacity ${flash ? "opacity-80" : "opacity-0"} duration-300`}></div>
                <p className={`absolute z-20 ${!innerTimer ? "hidden" : ""} text-stone-50 outline-black shadow-2xl font-bold text-4xl`}>{innerTimer}</p>
                <WebCam filter={filter} onProcessed={(pic) => setLatestProcessed(pic)}></WebCam>
              </div>
              <div className={"text-right text-white"}>
                <label> Timer Countdown: </label>
                <select onChange={changeTimer} disabled={isCapturing}>
                  <option value="3">3 secs</option>
                  <option value="5">5 secs</option>
                  <option value="10">10 secs</option>
                </select>
              </div>
              <div className={"flex justify-center"}>
                <div className={"flex flex-col w-4/5 gap-6"}>
                  <div className={"flex w-full h-20"}>
                    <div className={"relative flex-auto w-20 flex justify-center"}>
                      <button className={`absolute ${buttonColor} w-24 h-18 rounded-lg z-1 shadow-md transition-all duration-100 ease-in-out ${buttonAnimating[0] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[0] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(0, 1)}
                              onMouseUp={() => buttonAnimation(0, 1)}
                              onMouseOut={() => buttonAnimation(0, 0)}
                              onMouseDown={() => buttonAnimation(0, 2)} onClick={()=> {setFilter('Normal')}}>Normal</button>
                      <div className={`absolute ${buttonSideColor} w-24 h-18 rounded-lg mt-3`}></div>
                    </div>
                    <div className={"relative flex-auto w-20 flex justify-center"}>
                      <button className={`absolute ${buttonColor} w-24 h-18 rounded-lg z-1 shadow-md transition-all duration-100 ease-in-out ${buttonAnimating[1] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[1] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(1, 1)}
                              onMouseUp={() => buttonAnimation(1, 1)}
                              onMouseOut={() => buttonAnimation(1, 0)}
                              onMouseDown={() => buttonAnimation(1, 2)} onClick={()=> {setFilter('Old_School')}}>Old School</button>
                      <div className={`absolute  ${buttonSideColor} w-24 h-18 rounded-lg mt-3`}></div>
                    </div>
                    <div className={"relative flex-auto w-20 flex justify-center"}>
                      <button className={`absolute ${buttonColor} w-24 h-18 rounded-lg z-1 shadow-md transition-all duration-100 ease-in-out ${buttonAnimating[2] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[2] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(2, 1)}
                              onMouseUp={() => buttonAnimation(2, 1)}
                              onMouseOut={() => buttonAnimation(2, 0)}
                              onMouseDown={() => buttonAnimation(2, 2)} onClick={()=> {setFilter('TV')}}>TV</button>
                      <div className={`absolute  ${buttonSideColor} w-24 h-18 rounded-lg mt-3`}></div>
                    </div>
                    <div className={"relative flex-auto w-20 flex justify-center"}>
                      <button className={`absolute ${buttonColor} w-24 h-18 rounded-lg z-1 shadow-md transition-all duration-100 ease-in-out ${buttonAnimating[3] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[3] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(3, 1)}
                              onMouseUp={() => buttonAnimation(3, 1)}
                              onMouseOut={() => buttonAnimation(3, 0)}
                              onMouseDown={() => buttonAnimation(3, 2)} onClick={()=> {setFilter('Pop_Art')}}>Pop Art</button>
                      <div className={`absolute  ${buttonSideColor} w-24 h-18 rounded-lg mt-3`}></div>
                    </div>
                    <div className={"relative flex-auto w-20 flex justify-center"}>
                      <button className={`absolute ${buttonColor} w-24 h-18 rounded-lg z-1 shadow-md transition-all duration-100 ease-in-out ${buttonAnimating[4] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[4] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(4, 1)}
                              onMouseUp={() => buttonAnimation(4, 1)}
                              onMouseOut={() => buttonAnimation(4, 0)}
                              onMouseDown={() => buttonAnimation(4, 2)} onClick={()=> {setFilter('VHS')}}>VHS</button>
                      <div className={`absolute  ${buttonSideColor} w-24 h-18 rounded-lg mt-3`}></div>
                    </div>
                    <div className={"relative flex-auto w-20 flex justify-center"}>
                      <button className={`absolute ${buttonColor} w-24 h-18 rounded-lg z-1 shadow-md transition-all duration-100 ease-in-out ${buttonAnimating[5] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[5] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(5, 1)}
                              onMouseUp={() => buttonAnimation(5, 1)}
                              onMouseOut={() => buttonAnimation(5, 0)}
                              onMouseDown={() => buttonAnimation(5, 2)} onClick={()=> {setFilter('Neon')}}>Neon</button>
                      <div className={`absolute  ${buttonSideColor} w-24 h-18 rounded-lg mt-3`}></div>
                    </div>
                  </div>
                  <div className={"relative h-18 flex justify-center"}>
                    <div className={"relative flex-auto w-full flex justify-center px-2"}>

                        <div className={`relative ${buttonSideColor} w-full h-18 rounded-lg`}>
                          <button className={`absolute -top-3 ${buttonColor} shadow-md w-full h-18 rounded-lg z-2 transition-all duration-100 ease-in-out ${buttonAnimating[6] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[6] == 2 ? 'mt-[var(--click-button)]': ''}`}
                                  onMouseOver={() => buttonAnimation(6, 1)}
                                  onMouseUp={() => buttonAnimation(6, 1)}
                                  onMouseOut={() => buttonAnimation(6, 0)}
                                  onMouseDown={() => buttonAnimation(6, 2)}
                                  onClick={() => {startCapture()}} disabled={isCapturing}>Capture</button>
                        </div>


                    </div>
                    <div className={"absolute flex-auto w-full flex justify-center px-2"}>
                      <button className={`absolute -top-3 -right-20 flex-auto shadow-md h-18 w-18 z-1 transition-all duration-100 ease-in-out ${buttonAnimating[7] == 1 ? 'mt-[var(--hover-button)]': buttonAnimating[7] == 2 ? 'mt-[var(--click-button)]': ''}`}
                              onMouseOver={() => buttonAnimation(7, 1)}
                              onMouseUp={() => buttonAnimation(7, 1)}
                              onMouseOut={() => buttonAnimation(7, 0)}
                              onMouseDown={() => buttonAnimation(7, 2)}
                              onClick={() => {handleExport()}}>
                        <img className={"w-full h-full"} src={require("./icons/export.png")} />
                      </button>
                      <div className={"absolute -right-20 top-0 h-18 w-18 bg-red-400 rounded-2xl"}></div>
                    </div>
                  </div>
                </div>
              </div>




              {/*<MyButton></MyButton>*/}
              {/*<button onClick={()=> {setFilter('Old_School')}}>Old School</button>*/}
              {/*<button onClick={()=> {setFilter('TV')}}>TV</button>*/}
              {/*<button onClick={()=> {setFilter('Pop_Art')}}>Pop Art</button>*/}
              {/*<button onClick={()=> {setFilter('VHS')}}>VHS</button>*/}
              {/*<button onClick={()=> {setFilter('Neon')}}>Neon</button>*/}



            </div>
        </div>
        </div>
        <div className={"relative flex-1/3"}>
            <div onClick={() => {setCurrentFrame(0);}}><Picture list={pictures} num={"0"} current={currentFrame} state={filter} ref={componentRef} frame={"bg-[#6aab9c]"} className={"absolute h-full w-68 left-24 top-0 z-2"} /></div>
            <div onClick={() => {setCurrentFrame(1); }}><Picture list={pictures} num={"1"} current={currentFrame} state={filter} ref={componentRef2} frame={"bg-[#fa9284]"} className={"absolute h-full w-68 left-24 top-0 z-4"} /></div>
          <div onClick={() => {setCurrentFrame(2); }}><Picture list={pictures} num={"2"} current={currentFrame} state={filter} ref={componentRef3} frame={"bg-[#e06c78]"} className={"absolute h-full w-68 left-24 top-0 z-4"} /></div>
          <div onClick={() => {setCurrentFrame(3); }}><Picture list={pictures} num={"3"} current={currentFrame} state={filter} ref={componentRef4} frame={"bg-[#5874dc]"} className={"absolute h-full w-68 left-24 top-0 z-4"} /></div>
          <div onClick={() => {setCurrentFrame(4); }}><Picture list={pictures} num={"4"} current={currentFrame} state={filter} ref={componentRef5} frame={"bg-[#384e78]"} className={"absolute h-full w-68 left-24 top-0 z-4"} /></div>

            {/*<button className={"absolute h-full bg-[#e06c78] w-68 left-36 top-0 z-3"} onClick={() => {setCurrentFrame("bg-[#ed6c78]")}}></button>*/}
            {/*<button className={"absolute h-full bg-[#5784dc] w-68 left-48 top-0 z-2"} onClick={() => {setCurrentFrame("bg-[#5874dc]")}}></button>*/}
            {/*<button className={"absolute h-full bg-[#384e78] w-68 left-60 top-0 z-1"} onClick={() => {setCurrentFrame("bg-[#384e7b]")}}></button>*/}
            {/*<button className={" h-full w-80 mt-240"} onClick={() => {setCurrentFrame("bg-[url(https://i.pinimg.com/736x/cf/5e/27/cf5e272e452b9c7caa8fa0523eeeba9f.jpg)] bg-repeat")}}>*/}
            {/*  /!*<div className={"h-full w-full  bg-black -z-10"}>*!/*/}
            {/*  /!*</div>*!/*/}
            {/*  /!*<button onClick={() => {setCurrentFrame("bg-[url(https://i.pinimg.com/736x/cf/5e/27/cf5e272e452b9c7caa8fa0523eeeba9f.jpg)] bg-repeat")}}>Frame3</button>*!/*/}
            {/*  Frame 3*/}
            {/*</button>*/}
          </div>


      </div>
      </div>
    </>
  )
}

export default App