import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { io } from "socket.io-client"



const socket = io("http://localhost:5000/");

function WebCam(props) {
    const webcamRef = React.useRef(null);
    const [processed, setProcessed] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (webcamRef.current) {
                const screenshot = webcamRef.current.getScreenshot();
                if (screenshot) {
                    socket.emit('image', {sc: screenshot, filter: props.filter, setting: props.setting});
                }
                if (props.onProcessed) props.onProcessed(screenshot);
            }
        }, 10);
        return () => {
            clearInterval(interval);
        };
    }, [props.filter, props.onProcessed]);

    useEffect(() => {
        socket.on('response_back', function(data) {
            setProcessed(data);
            props.filtered(data);
        });
        return () => socket.off("response_back");
    }, []);

    return (
        <>  
            <Webcam ref={webcamRef} width={640} screenshotFormat="image/jpeg" mirrored="true"/>
            <div className='absolute top-0 left-0 z-10'>
                {processed && <img src={processed} width={640} alt="Processed" />}
            </div>
        </>
    )
}

export default WebCam