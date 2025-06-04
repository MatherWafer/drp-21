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

  // GeoJSON uses [lng, lat] order ➜ convert once
  const ring = region.map(({ lat, lng }) => [lng, lat]) as [number, number][];

  const poly   = polygon([ring]);                     // { type: 'Polygon', ... }
  const pt     = point([target.lng, target.lat]);     // { type: 'Point', ... }

  return booleanPointInPolygon(pt, poly);
}
