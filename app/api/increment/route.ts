// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  const updated = await prisma.counter.update({
    where: { id: 1 },
    data: { value: { increment: 1 } },
  });

  return NextResponse.json({ value: updated.value });
}

export async function GET() {
  const counter = await prisma.counter.findUnique({ where: { id: 1 } });
  return NextResponse.json({ value: counter?.value ?? 0 });
}