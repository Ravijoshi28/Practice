import { randomUUID } from "node:crypto";
import { prisma } from "../lib/neon";
import { GeneralLimiter } from "../lib/rate_Limiter";

export async function  shortController(req,res){
   const userId=req.user.user;
    
   try {

    const forwardedFor=req.headers["x-forwarded-for"]
        const clientIp=typeof forwardedFor==="string"?forwardedFor.split(",")[0].trim():req.socket.remoteAddress;
        console.log(clientIp)
    
        const requestLimit=await GeneralLimiter.limit(
          `Request:email:${userId}`
        )
    
       
        if(!requestLimit.success){
          return res.status(429).json({message:"Too many request"})
        }

        

    const {alias="default",link}=await req.body;
    const shortform="abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let form="";

    if(alias!="default"){

         const slink = await prisma.shortedLink.create({
  data: {
    originalLink: link,
    shortLink:alias,
    createdBy: {
      connect: {
        id: Number(userId),
      },
    },
  },
});   


return res.status(200).json({data:"Link created"});     
    }

    for(let i=0;i<8;i++){
        form+=shortform[Math.floor(Math.random()*shortform.length)]
      }
    
    const slink = await prisma.shortedLink.create({
  data: {
    originalLink: link,
    shortLink:form ,
    createdBy: {
      connect: {
        id: Number(userId),
      },
    },
  },
});

return res.status(200).json({data:"Link created"});
   } catch (error) {
    console.log(error)
   }

}