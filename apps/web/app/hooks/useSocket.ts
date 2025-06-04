import { useEffect, useState } from "react";
import { WEB_SOCKET_URL } from "../config";

export function useSocket(){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>();
    useEffect(()=>{
        const ws=new WebSocket("ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjA2MmUxNS00YTg1LTQ1YTQtYmE4MC0xZjQyOWYzMmI1ODkiLCJpYXQiOjE3NDg5ODEzMjksImV4cCI6MTc0ODk4NDkyOX0.8ZX_UDOmxx1pVclVhxPUAbVZI0YHsrTd_2dpdLjWgQg");
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[]);
    return{
        socket,
        loading
    }
}