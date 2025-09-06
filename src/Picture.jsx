import { io } from "socket.io-client"
import React, { useEffect, useState, forwardRef } from 'react'

const socket = io("http://localhost:5000/");

const Picture = forwardRef((props, ref) => {

    const [listofPics, setListofPics] = useState([props.list]);
    const [filteredPics, setFilteredPics] = useState([props.list]);


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
        <div className="shadow-md bg-slate-300" ref={ref}>
            <div className="w-52 p-3 inline-grid grid-cols-1 gap-3">
                {filteredPics.map((pic, i) => (<img src={pic} alt="oh" key={i}/>)).reverse().slice(0,4)}
            </div>
        </div>
    )
});

export default Picture