"use client"

import { WEB_SOCKET_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket]=useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws=new WebSocket(`${WEB_SOCKET_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkY2I3ZGU2NC05ZDZmLTQ0YTktYjUwMC05OWMwNmFhM2QwYjUiLCJpYXQiOjE3NDkxNTM3OTksImV4cCI6MTc0OTE1NzM5OX0.0zx15299on4mc2Gn4C9SEtWBt3Dq95kuq1lgNUZU_Ds`)
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