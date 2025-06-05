'use client';

import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PrismaClient } from '@prisma/client';
import { LatLng } from '../api/util/geoHelpers';


export type RoiData = {
  perimeter: LatLng[],
  radius:    number,
  center:    LatLng
}

const defaultRoiData: RoiData = 
{
perimeter: [],
radius:3,
center:
  {lat: 51.512409,
  lng: -0.125146 }
}
function averageLoc(interestRegion: LatLng[]): LatLng {
  const { lat, lng } = interestRegion.reduce(
    (acc, { lat, lng }) => ({
      lat: acc.lat + lat,
      lng: acc.lng + lng
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: lat / interestRegion.length,
    lng: lng / interestRegion.length
  };
}

const getDistance = (p1: LatLng, p2: LatLng) => {
  const φ1 = p1.lng * Math.PI/180;
  const φ2 = p2.lng * Math.PI/180;
  const Δφ = (p2.lng - p1.lng) * Math.PI/180;
  const Δλ = (p2.lat - p1.lat) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = 6371e3 * c; 

  var distance = d
  return distance / 1600
}
const UserContext = createContext<
{
  displayName: string | null,
  interestRegion: RoiData
  loadProfile:  (() => Promise<void> )| null
}
>({
  displayName: null,
  interestRegion: defaultRoiData,
  loadProfile: null
});

const loadProfile = async (setDisplayName: Dispatch<SetStateAction<string | null>>, 
  setInterestRegion: Dispatch<SetStateAction<RoiData>>
  ) => {
  console.log("Starting to load!")
  const supabase = createClientComponentClient();
  const data = await supabase.auth.getUser();
  const session = data.data
  if (!session) return;
  const res = await fetch("/api/context", { method: "GET" });
  const body = await res.json()
  let regionData = defaultRoiData
  if(body.interestRegion) {
    const perimeter = body.interestRegion as LatLng[]
    const center = averageLoc(perimeter)
    const radius = Math.max(...perimeter.map((ll:LatLng) => getDistance(center,ll)))
    regionData = {perimeter,radius,center}
    console.log(regionData)
  }
  if(res){
    setDisplayName(body.name);
    body.interestRegion && setInterestRegion(regionData)
  }
}
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [interestRegion, setInterestRegion] = useState<RoiData>(defaultRoiData)
  useEffect(() => {
    console.log("Starting to load!")
    loadProfile(setDisplayName, setInterestRegion);
  }, []);

  return (
    <UserContext.Provider value={{ displayName, interestRegion:interestRegion, loadProfile:() => loadProfile(setDisplayName, setInterestRegion)}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
