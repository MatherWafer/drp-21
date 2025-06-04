// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId, withProfileId } from '../util/backendUtils';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const reqData = await req.json()
  const data = await withProfileId(reqData)
  console.log(data)
  const post = await prisma.interestRegion.create({data})
  return NextResponse.json({ post }, { status: 200 });
}