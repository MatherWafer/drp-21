// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const {uuid} = await req.json()
  const user = await prisma.profile.findUnique({
    where: {
        id: uuid
    }
  })
  const cookieStore = await cookies();
  if(user?.name){
    cookieStore.set("name", user.name)
  }
  return new NextResponse();
}
