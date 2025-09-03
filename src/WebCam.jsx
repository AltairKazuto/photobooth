import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { io } from "socket.io-client"


const socket = io("http://localhost:5000/");

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: "user"
// };

const WebCam = () => {
    const webcamRef = React.useRef(null);
    const [processed, setProcessed] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (webcamRef.current) {
                const screenshot = webcamRef.current.getScreenshot();
                if (screenshot) {
                    socket.emit('image', screenshot)
                }
            }
        }, 10);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        socket.on('response_back', function(data) {
            setProcessed(data);
        });
        return () => socket.off("response_back");
    }, []);
    // socket.on('connect', function() {
    //     socket.emit('message', {data: 'I\'m connected!'});
    // })
        
    return (
        <>  
           
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" mirrored="true"/>

            {processed && <img src={processed} alt="Processed" />}
        </>
    )
}

export default WebCam