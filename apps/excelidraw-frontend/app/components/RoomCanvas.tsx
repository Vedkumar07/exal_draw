"use client"

import { WEB_SOCKET_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket]=useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws=new WebSocket(`${WEB_SOCKET_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjA2MmUxNS00YTg1LTQ1YTQtYmE4MC0xZjQyOWYzMmI1ODkiLCJpYXQiOjE3NDkwNjM3NDcsImV4cCI6MTc0OTA2NzM0N30.eoUFQSsfRdt27Uid8JM6hSfltqvlmfbGKPPxkPfp4ps`)
        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
    },[])
    if(!socket){
        return <div>
            Coneecting to server...
        </div>
    }
    return<div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}