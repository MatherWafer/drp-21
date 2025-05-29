// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
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
  return NextResponse.json({ value: inserted.id });
}
