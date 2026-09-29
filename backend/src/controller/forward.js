import { prisma } from "../lib/neon.js";

export async function Forward(req,res){

   try {
         const {alias}=req.params;

        if (!alias || alias === "undefined") {
            console.log("undefine")
    return res.status(400).json({
      message: "Alias is required",
    });
  }
    const original=await prisma.shortedLink.update({
        where:{
           shortLink: alias
        },
        data:{
            click:{
                increment:1
            },
        },
        select:{
            originalLink:true
        }
    });

    

 return res.redirect(302, original.originalLink);
   } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Short link not found" });
    }
    console.error("Failed to redirect short link:", error);
    return res.status(500).json({ message: "Could not redirect short link" });
   }
}
