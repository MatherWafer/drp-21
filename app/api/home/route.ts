// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const {uuid} = await req.json()
  const user = await prisma.profile.findUnique({
    where: {
        id: uuid
    }
  })
  return NextResponse.json({ name:user?.name});
}
