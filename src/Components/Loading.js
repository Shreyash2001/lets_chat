import React from 'react'
import {Circle} from "better-react-spinkit"
import "./Loading.css"

function Loading() {
    return (
        <center className="loading">
            <h1>Welcome to LetsChat</h1>
            <Circle color="#fff" size={60} />
        </center>
    )
}

export default Loading
