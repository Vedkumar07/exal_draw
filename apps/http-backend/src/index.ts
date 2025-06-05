import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import middleware from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"
import cors from "cors";
const app=express();
app.use(express.json());
app.use(cors());


app.post("/signup",async (req,res)=>{
    const parseData=CreateUserSchema.safeParse(req.body);
    if(!parseData.success){
        console.log(parseData.error);
         res.json({
            message:"Incorrect input"
        })
        return;
    }
    try{
        const user=await prismaClient.user.create({
        data:{
            email:parseData.data?.username,
            password:parseData.data?.password,
            name:parseData.data?.name
            }
       })
       res.json({
          userId:user.id
        })
    }catch(e){
        res.status(411).json({
            mesage:"User already exist"
        })
    }
});
app.post("/signin",async (req,res)=>{
    const parseData=SigninSchema.safeParse(req.body);
    if(!parseData.success){
         res.json({
            message:"Incorrect input"
        })
        return;
    }
    const user=await prismaClient.user.findFirst({
       where:{
          email:parseData.data.username,
          password:parseData.data.password
        }
    })
    if(!user){
      res.status(403).json({
         message:"user dosent exist"
        })
    }
    const token = jwt.sign({ userId: user?.id }, JWT_SECRET, { expiresIn: "1h" });

        console.log(`"token":${token}`);
    res.json({
          token
        })
});
app.post("/room",middleware,async(req,res)=>{
    const parseData=CreateRoomSchema.safeParse(req.body);
    if(!parseData.success){
         res.json({
            message:"Incorrect input"
        })
        return;
    }
    //@ts-ignore
    const userId=req.userId;
    console.log(`userId:${userId}`);
    try{
        const room=await prismaClient.room.create({
        data:{
            slug:parseData.data.name,
            adminId:userId
        }
    })
    res.json({
        roomId:room.id
    })
    }catch(e){
         res.status(411).json({
           error:e
        })
    }
});
app.get("/chats/:roomId",async (req,res)=>{
    try{
        const roomId=Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages=await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50
        })
        res.json({
          messages
        })
    }catch(e){
        res.json({
            error:e
        })
    }
})
app.get("/room/:slug",async (req,res)=>{
        const slug=req.params.slug;
        console.log(req.params.slug);
        const room=await prismaClient.room.findFirst({
        where:{
            slug
        }});
        res.json({
            room
        })
})
app.listen(3001);