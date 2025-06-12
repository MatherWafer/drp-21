// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId, withProfileId } from '../../../util/backendUtils';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json() as {postId: string}
  const data_dash = await withProfileId(data) 
  const post = await prisma.favourite.upsert({
  where: {
    postId_profileId: data_dash, // your unique composite key object
  },
  update: {}, // no changes, or if you want to update a timestamp, add here
  create: data_dash,
})

  return new NextResponse();
}


export async function DELETE(req: NextRequest) {
    const data = await req.json()
    const data_dash = await withProfileId(data)
    const post = await prisma.favourite.delete({
        where:{
            postId_profileId:data_dash
        }
    })
    return new NextResponse();
  }
  