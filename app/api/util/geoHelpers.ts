// geo-helpers.ts
import { polygon, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

export type LatLng = { lat: number; lng: number };

/**
 * Returns true when (lat, lng) lies inside (or on the edge of) `region`.
 *
 * @param target    The point to test.
 * @param region    List of vertices describing the polygon’s perimeter.
 *                  Must be *closed* (first ≠ last vertex is fine—Turf will auto-close it).
 */
export function isInside(
  target: LatLng,
  region: LatLng[]
): boolean {
  if (region.length < 3) throw new Error("Polygon needs ≥ 3 vertices");

  region.push(region[0])
  const ring = region.map(({ lat, lng }) => [lng, lat]) as [number, number][];
  const poly   = polygon([ring]);                     
  const pt     = point([target.lng, target.lat]);     

  return booleanPointInPolygon(pt, poly);
}

export const geocodeLocation = async (latitude:number,longitude:number) => {
  const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const geocodeResponse = await fetch(geocodeUrl, {
    headers: {
      'User-Agent': 'Change.ldn/1.0 (ayaanmather@hotmail.com)', 
    },
  });

  let location = 'Unknown location';
  if (geocodeResponse.ok) {
    const geocodeData = await geocodeResponse.json();
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
  } else {
    console.error('Geocoding failed:', geocodeResponse.status);
  }
  return location
}
