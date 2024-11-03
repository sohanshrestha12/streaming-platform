import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest,NextResponse } from "next/server";


export async function POST(req:NextRequest){
    if(req.method !== 'POST'){
        return NextResponse.json(
          { message: "Method not allowed" },
          { status: 405 }
        );
    }
    const session = await getServerSession({req,...authOptions}); 
  

    if(!session || !session.user.email) NextResponse.json({message:'Unauthorized'},{status:401});

    try {
      const {username} = await req.json();
      if(!username)  NextResponse.json({message:'username is required!'},{status:400});

      const existingUser = await prisma.user.findUnique({where:{username}});
      if(existingUser) NextResponse.json({message:'Username already taken'},{status:400});

      await prisma.user.update({where:{email:session?.user.email as string},data:{username}});
      return  NextResponse.json({message:'Username set Successfully'},{status:200});
    } catch (error) {
       return NextResponse.json(
         { message: `Invalid request! Error:${error}` },
         { status: 400 }
       );
    }
   
}