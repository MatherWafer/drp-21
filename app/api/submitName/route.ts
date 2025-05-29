// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const {name} = await req.json()
  const inserted = await prisma.profile.create({
    data: {
      name:name
    }
  })
  console.log(inserted)
  const cookieStore=  await (cookies());
  cookieStore.set("uuid", inserted.id)
  cookieStore.set("name", inserted.name)
  return new NextResponse();
}
