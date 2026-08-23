// Hand-duplicated from shandilya-mobile/apps/mobile/src/lib/bearing.ts -
// parle doesn't import that repo's package, so small pure functions like
// this are mirrored rather than shared, per the existing project convention
// (see seller-types.ts).

export type LatLng = { lat: number; lng: number };

/**
 * Great-circle initial bearing from `from` to `to`, in degrees (0-360,
 * 0 = north). Used to rotate the truck marker between two consecutive
 * positions received over the live-tracking socket.
 */
export function computeBearing(from: LatLng, to: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
