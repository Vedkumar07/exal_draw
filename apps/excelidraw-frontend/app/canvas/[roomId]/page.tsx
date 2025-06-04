"use client"
import { useEffect, useRef } from "react"

export default function Canvas(){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        if(canvasRef.current){
            const canvas=canvasRef.current;
            const ctx=canvas.getContext("2d");
            if(!ctx){
                return
            }
            let cliked=false;
            let statX=0;
            let startY=0;
            canvas.addEventListener("mousedown",(e)=>{
                cliked=true;
                statX=(e.clientX);
                startY=(e.clientY);
            })
            canvas.addEventListener("mouseup",(e)=>{
                cliked=true;
                console.log(e.clientX);
                console.log(e.movementY);
            })
            canvas.addEventListener("mousemove",(e)=>{
                if (cliked){
                     const width=e.clientX-statX;
                     const height=e.clientY-startY;
                     ctx.clearRect(0,0,canvas.width,canvas.height);
                     ctx.strokeRect(statX,startY,width,height);
                }
            })
        }
    },[canvasRef])
    return<div>
        <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
}