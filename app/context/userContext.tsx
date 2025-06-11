'use client';

import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LatLng } from '../api/util/geoHelpers';
import { ROIResponse } from '../api/util/backendUtils';


export type RoiData = {
  perimeter: LatLng[],
  radius:    number,
  center:    LatLng,
  id:        string,
  name:      string
}

export const defaultRoiData: RoiData = 
{
perimeter: [],
radius:3,
center:
  {lat: 51.512409,
  lng: -0.125146 },
id: '1',
name: ''
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
  userLoaded: boolean
  displayName: string | null,
  interestRegions: RoiData[]
  loadProfile:  (() => Promise<void> )| null
  setInterestRegions: Dispatch<SetStateAction<RoiData[]>>
}
>({
  userLoaded: false,
  displayName: null,
  interestRegions: [defaultRoiData],
  loadProfile: null,
  setInterestRegions: () => {}
});

export const getRoiData = (interestRegion: LatLng[],  id: string, name: string): RoiData => { 
    const perimeter = interestRegion
    const center = averageLoc(perimeter)
    const radius = Math.max(...perimeter.map((ll:LatLng) => getDistance(center,ll)))
    return {perimeter,radius,center, id, name}
  }

const loadProfile = async (
  setDisplayName: Dispatch<SetStateAction<string | null>>, 
  setInterestRegion: Dispatch<SetStateAction<RoiData[]>>,
  setUserLoaded: Dispatch<SetStateAction<boolean>>,
  ) => {
  const supabase = createClientComponentClient();
  const data = await supabase.auth.getUser();
  const session = data.data
  if (!session) return;
  const res = await fetch("/api/context", { method: "GET" });
  const body = await res.json()
  let regionDatas = [defaultRoiData]
  if(body.interestRegion) {
    regionDatas = (body.interestRegion as ROIResponse[]).map(rd => getRoiData(rd.region as LatLng[], rd.id, rd.name ? rd.name : ''))
  }
  if(res){
    body.interestRegion && setInterestRegion(regionDatas)
    setUserLoaded(true)
  }
}
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [interestRegions, setInterestRegions] = useState<RoiData[]>([defaultRoiData])
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  useEffect(() => {
    loadProfile(setDisplayName, setInterestRegions, setUserLoaded);
  }, []);

  return (
    <UserContext.Provider value={{ userLoaded, setInterestRegions, displayName, interestRegions:interestRegions, loadProfile:() => loadProfile(setDisplayName, setInterestRegions, setUserLoaded)}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
