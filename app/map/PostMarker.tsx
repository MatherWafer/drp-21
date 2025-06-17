import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { PostInfo } from "../user/posts/PostOverview";
import { useState, useEffect } from "react";

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function PostMarker(props: {
  post: PostInfo;
  maxLikes: number;
  setter: React.Dispatch<React.SetStateAction<PostInfo | undefined>>;
}) {
  const { latitude, longitude, likeCount, category, hasFavourited } = props.post;
  const [hovered, setHovered] = useState(false);
  const { width } = useWindowSize();

  // Adjust base size based on screen width
  const isMobile = width < 768;
  const baseSize = isMobile
    ? 20 * (1 + 0.5 * likeCount / props.maxLikes)
    : 25 * (1 + 0.5 * likeCount / props.maxLikes);
  const focusSize = 1.5 * baseSize;

  // Define icons for each category
  const getCategoryIcon = (category: string) => {
    const iconStyle = {
      width: `${hovered ? focusSize * 0.5 : baseSize * 0.5}px`,
      height: `${hovered ? focusSize * 0.5 : baseSize * 0.5}px`,
      filter: hasFavourited ? "grayscale(100%) brightness(0%)" : "none",
    };

    switch (category) {
      case "Cycling":
        return (
          <img
            src="/cycling.svg"
            alt="Cycling Icon"
            style={iconStyle}
          />
        );
      case "Roadworks":
        return (
          <img
            src="/roadworks.svg"
            alt="Roadworks Icon"
            style={iconStyle}
          />
        );
      case "Parks":
        return (
          <img
            src="/park.svg"
            alt="Parks Icon"
            style={iconStyle}
          />
        );
      case "Other":
      case "None":
      default:
        return (
          <img
            src="/lightbulb.svg"
            alt="Default Icon"
            style={iconStyle}
          />
        );
    }
  };

  return (
    <AdvancedMarker
      position={{ lat: latitude, lng: longitude }}
      onClick={() => props.setter(props.post)}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: `${hovered ? focusSize : baseSize}px`,
          height: `${hovered ? focusSize : baseSize}px`,
          background: hasFavourited
            ? "radial-gradient(circle, #ffcc00 20%, #b38f00 80%)"
            : "radial-gradient(circle, #ff4d4d 20%, #b30000 80%)",
          border: "4px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: hovered ? "pulse 1.5s infinite" : "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {getCategoryIcon(category)}
      </div>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7);
            }
            70% {
              transform: scale(1.1);
              box-shadow: 0 0 0 10px rgba(255, 204, 0, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(255, 204, 0, 0);
            }
          }
        `}
      </style>
    </AdvancedMarker>
  );
}