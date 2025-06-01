import { WebSocketServer ,WebSocket} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client";

const wss=new WebSocketServer({port:8080});

interface User{
    ws:WebSocket,
    rooms:string[],
    userId:string
}

const users:User[]=[];

function checkUser(token:string):string|null{
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}
wss.on('connection',function connection(ws,request){
    const url=request.url;
    if(!url){
        return;
    }
    const querParams=new URLSearchParams(url.split('?')[1]);
    const token=querParams.get("token")||"";
    const userId=checkUser(token);
    if(userId==null){
        ws.close()
        return null;;
    }
    users.push({
        userId,
        rooms:[],
        ws   
    })

    ws.on('message',async function message(data){
        let pasrseData;
        if (typeof data !== "string") {
           pasrseData= JSON.parse(data.toString());
        }else {
           pasrseData = JSON.parse(data); // {type: "join-room", roomId: 1}
        }
        console.log(`pasrseData:${pasrseData}`);
        if(pasrseData.type==="join_room"){
            const user=users.find(x=>x.ws===ws);
            user?.rooms.push(pasrseData.roomId);
        }
        if(pasrseData.type==="leave_room"){
            const user=users.find(x=>x.ws===ws);
            if(!user){
                return;
            }
            user.rooms=user?.rooms.filter(x=>x===pasrseData.rooms);
        }
        if(pasrseData.type==="chat"){
            const roomId=pasrseData.roomId;
            const message=pasrseData.message;
            await prismaClient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            });
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            })
        }
    });
});