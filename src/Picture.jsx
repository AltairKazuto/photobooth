import { io } from "socket.io-client"
import React, { useEffect, useState, forwardRef } from 'react'

const socket = io("http://localhost:5000/");

const Picture = forwardRef((props, ref) => {

    const [listofPics, setListofPics] = useState([props.list]);
    const [filteredPics, setFilteredPics] = useState([props.list]);
    const [frameAnimating, setFrameAnimating] = useState(0);

    const offsets = ['ml-12', 'ml-24', 'ml-36', 'ml-48', 'ml-60']
    const zIndex = ['z-5', 'z-4', 'z-3', 'z-2', 'z-1']

    useEffect(() => {
        console.log('inhere', props.current, props.num)
        if (props.current == props.num) {
            setFrameAnimating(1)
        }
        else {
            setFrameAnimating(0)
    }}, [props.current])
        // setTimeout(() => setFrameAnimating(0), 500)

    useEffect(() => {
        setListofPics(props.list);
    }, [props.list])

    useEffect(() => {
        socket.emit("list_image", {sc: listofPics, filter: props.state});
    }, [props.state, listofPics]);


    useEffect(() => {
        socket.on('list', function(data) {
            setFilteredPics(data);
        });
        return () =>{
            socket.off("list")
        }
    }, [])


    return (
        <div className={`absolute shadow-md ${props.frame} h-full w-68 transition-all duration-300 ease-in-out ${ frameAnimating == 1 ? 'ml-0 z-10': offsets[props.num] + ' ' + zIndex[props.num]} ${zIndex[props.num]}`}  ref={ref}>
            <div className="h-full w-full p-6 inline-grid grid-cols-1 gap-6">
                {filteredPics.map((pic, i) => (<img src={pic} alt="oh" key={i}/>)).reverse().slice(0,4)}
            </div>
        </div>
    )
});

export default Picture