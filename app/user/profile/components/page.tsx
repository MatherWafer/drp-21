'use client'
import { useUser } from "../../../context/userContext";
import RoiDisplay from "./RoiDisplay";

function Feed(){
    const {interestRegions} = useUser()
    const GOOGLE_MAPS_API_KEY = 'AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY';
    return (
        <main className="text-center bg-white text-teal m-0">
    <RoiDisplay
            apiKey={GOOGLE_MAPS_API_KEY}
            interestRegion={interestRegions[0]}
        />
        </main>
    );
}

export default Feed
