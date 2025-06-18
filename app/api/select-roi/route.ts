// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId, withProfileId } from '../util/backendUtils';
const prisma = new PrismaClient();
import { Prisma } from '@prisma/client';
import { LatLng } from '../util/geoHelpers';


export function latLngArrayToGeometry(coordinates: LatLng[]): Prisma.Sql {
  // Validate input

  // Ensure the polygon is closed by appending the first point if necessary
  const isClosed =
    coordinates[0].lat === coordinates[coordinates.length - 1].lat &&
    coordinates[0].lng === coordinates[coordinates.length - 1].lng;
  const closedCoordinates = isClosed ? coordinates : [...coordinates, coordinates[0]];

  // Convert to WKT POLYGON format: POLYGON((lng1 lat1, lng2 lat2, ..., lng1 lat1))
  const wktPoints = closedCoordinates
    .map(({ lat, lng }) => `${lng} ${lat}`) // Convert to "lng lat" order
    .join(', ');
  const wkt = `POLYGON((${wktPoints}))`;
  console.log(wkt)
  return Prisma.sql`ST_GeomFromText(${wkt}, 4326)`;
}



export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    const data = await withProfileId(reqData);
    const regionJSON = data.regionJson as LatLng[];
    const regionGeometry = latLngArrayToGeometry(regionJSON);

    const post = await prisma.$queryRaw`
    INSERT INTO "InterestRegion" ("id", "profileId", "name", "region", "regionJson")
    VALUES (
      ${Prisma.sql`uuid_generate_v4()`},
      ${data.profileId}::uuid,
      ${data.name || null},
      ${regionGeometry},
      to_jsonb(${regionJSON})::jsonb
    )
    RETURNING "id", "profileId", "name", ST_AsText("region") AS region, "regionJson"
  `;



    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating InterestRegion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const reqData = await req.json();
    const { id } = reqData; // ID of the region to delete
    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Missing region id' }), { status: 400 });
    }

    const deleted = await prisma.interestRegion.delete({
      where: {
        id: id,             // match by region id
      },
    });

    return new NextResponse(JSON.stringify({ success: true, deleted }), { status: 200 });

  } catch (err: any) {
    console.error('Delete region error:', err);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete region' }), { status: 500 });
  }
}