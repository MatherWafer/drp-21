import { AdvancedMarker } from "@vis.gl/react-google-maps"
import { PostInfo } from "../user/posts/PostOverview"
import { useState } from "react";
export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export default function PostMarker(props: {
  post:PostInfo,
    setter:React.Dispatch<React.SetStateAction<PostInfo | undefined>>}){
  const {latitude,longitude} = props.post
  const [hovered,setHovered] = useState(false)
  const [focused,setFocused] = useState(true)
  return (<AdvancedMarker position={{lat:latitude,lng:longitude}} onClick={(e) =>props.setter(props.post)}>
              <div
              onMouseEnter={ e=> setHovered(true)}
              onMouseLeave={e => setHovered(false)}
                style={{
                  width: hovered? '30px' : '20px',
                  height: hovered? '30px' : '20px',
                  border: '2px solid white',
                  borderRadius: '50%',
                  backgroundColor: focused? "#bb0000" : '#00bb00',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            </AdvancedMarker>
  )
}