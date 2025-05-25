import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import middleware from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types";
const app=express();
app.post("/signup",async(req,res)=>{
    const data=CreateUserSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            message:"Incorrect input"
        })
    }
    res.json({
        message:"signin"
    })
});
app.post("/signin",(req,res)=>{
    const data=SigninSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            message:"Incorrect input"
        })
    }
    res.json({
        message:"signin"
    })
   const userId=1;
   const token= jwt.sign({
        userId
    },JWT_SECRET);
    res.json({
        token
    })
});
app.post("/room",middleware,async(req,res)=>{
    const data=CreateRoomSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            message:"Incorrect input"
        })
    }
    res.json({
        message:"signin"
    })
    res.json({
        roomId:123
    })
});
app.listen(3001);