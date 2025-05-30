// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { latitude, longitude } = data;

    // Validate latitude and longitude
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    // Perform reverse geocoding with Nominatim
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const geocodeResponse = await fetch(geocodeUrl, {
      headers: {
        'User-Agent': 'Change.ldn/1.0 (ayaanmather@hotmail.com)', // Use your app name and email
      },
    });

    let location = 'Unknown location';
    if (geocodeResponse.ok) {
      const geocodeData = await geocodeResponse.json();
      console.log(geocodeData)
      location = ""
      if(geocodeData.address.road){
        location += geocodeData.address.road
      }
      if(geocodeData.address.neighbourhood){
        location += ", " + geocodeData.address.neighbourhood
      }
      if(geocodeData.address.suburb){
        location += ", " + geocodeData.address.suburb
      }
      if(geocodeData.address.city){
        location += ", " + geocodeData.address.city
      }
      console.log(location)
    } else {
      console.error('Geocoding failed:', geocodeResponse.status);
    }

    // Add location to the data object
    const postData = {
      ...data,
      locationText:location, // Assuming your Prisma schema has a 'location' field
    };

    // Create the post with Prisma
    const post = await prisma.post.create({ data: postData });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
}