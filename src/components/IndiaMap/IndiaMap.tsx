import React, { useState, useEffect, useRef } from "react";
import { IndiaMapProps } from "../../types/MapTypes";
import { fetchSVGContent } from "../../utils/mapUtils";

interface HoverInfo {
  name: string;
  id: string;
  title: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  mapStyle = {
    hoverColor: "#e0e0e0",
    backgroundColor: "#000000", // Default background color
  },
  stateData = [],
  onStateHover,
  onStateClick,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  // Remove unused state variable
  const [, setTooltipPos] = useState({ x: 0, y: 0 });
  // Store original colors of paths
  const originalColors = useRef<Map<string, string>>(new Map());
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSVG = async () => {
      const content = await fetchSVGContent();
      if (content) setSvgContent(content);
    };
    loadSVG();
  }, []);

  // Initialize the map once the SVG is loaded
  useEffect(() => {
    if (svgContent && mapContainerRef.current) {
      // Wait for the DOM to be updated
      setTimeout(() => {
        const paths = mapContainerRef.current?.querySelectorAll("path");
        if (paths) {
          paths.forEach((path) => {
            const pathElement = path as SVGPathElement;
            const id = pathElement.getAttribute("id") || "";

            // Set the background color for each path
            pathElement.setAttribute("fill", mapStyle.backgroundColor || "#000000");

            // Store original color (which is now the background color)
            originalColors.current.set(id, mapStyle.backgroundColor || "#000000");
          });
        }
      }, 100);
    }
  }, [svgContent, mapStyle.backgroundColor]);

  const handleMouseEnter = (element: SVGPathElement) => {
    const stateName = element.getAttribute("data-name") || "";
    const pathId = element.getAttribute("id") || "";
    const pathTitle = element.getAttribute("title") || "";

    setHoverInfo({ name: stateName, id: pathId, title: pathTitle });

    if (onStateHover) {
      const stateInfo = stateData.find((state) => state.id === pathId);
      // @ts-ignore
      onStateHover(pathId, stateInfo);
    }
  };

  const handleClick = (element: SVGPathElement) => {
    const pathId = element.getAttribute("id") || "";
    if (onStateClick) {
      const stateInfo = stateData.find((state) => state.id === pathId);
      // @ts-ignore
      onStateClick(pathId, stateInfo);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoverInfo) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
    if (onStateHover) {
      // @ts-ignore
      onStateHover("", undefined);
    }
  };

  return (
    <div className="india-map-container" onMouseMove={handleMouseMove}>
      <div
        ref={mapContainerRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onMouseOver={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            // No need to store pathId if not used
            // Apply hover color
            path.setAttribute("fill", mapStyle.hoverColor || "#e0e0e0");
            handleMouseEnter(path);
            setTooltipPos({ x: e.clientX, y: e.clientY });
          }
        }}
        onClick={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            handleClick(path);
          }
        }}
        onMouseOut={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            // Restore original color (background color)
            path.setAttribute("fill", mapStyle.backgroundColor || "#000000");
            handleMouseLeave();
          }
        }}
      />
    </div>
  );
};
