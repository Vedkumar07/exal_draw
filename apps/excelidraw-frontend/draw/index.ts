export function initDraw(canvas:HTMLCanvasElement){
            const ctx=canvas.getContext("2d");
            if(!ctx){
                return
            }
            ctx.fillStyle="rgba(0,0,0)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
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
                     ctx.fillStyle="rgba(0,0,0)";
                     ctx.fillRect(0,0,canvas.width,canvas.height);
                     ctx.strokeStyle="rgba(225,225,225)"
                     ctx.strokeRect(statX,startY,width,height);
                }
            })
}