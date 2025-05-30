// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json()
  const post = await prisma.favourite.create({data})
  return new NextResponse();
}


export async function DELETE(req: NextRequest) {
    const data = await req.json()
    const post = await prisma.favourite.delete({
        where:{
            postId_profileId:data
        }
    })
    return new NextResponse();
  }
  