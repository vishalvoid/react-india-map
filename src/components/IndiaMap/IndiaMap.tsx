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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  // Store original colors of paths
  const originalColors = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const loadSVG = async () => {
      const content = await fetchSVGContent();
      if (content) setSvgContent(content);
    };
    loadSVG();
  }, []);

  // Initialize the map once the SVG is loaded
  useEffect(() => {
    if (svgContent) {
      // Wait for the DOM to be updated
      setTimeout(() => {
        const paths = document.querySelectorAll(".india-map-container path");
        paths.forEach((path) => {
          const pathElement = path as SVGPathElement;
          const id = pathElement.getAttribute("id") || "";
          // Store default fill or use backgroundColor if no fill is set
          const defaultFill =
            pathElement.getAttribute("fill") || mapStyle.backgroundColor || "#000000";
          originalColors.current.set(id, defaultFill);
          // Set initial background color
          pathElement.setAttribute("fill", defaultFill);
        });
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
      onStateHover(pathId, stateInfo);
    }
  };

  const handleClick = (element: SVGPathElement) => {
    const pathId = element.getAttribute("id") || "";
    if (onStateClick) {
      const stateInfo = stateData.find((state) => state.id === pathId);
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
      onStateHover("", undefined);
    }
  };

  return (
    <div className="india-map-container" onMouseMove={handleMouseMove}>
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onMouseOver={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            const pathId = path.getAttribute("id") || "";
            // Store original color if not yet stored
            if (!originalColors.current.has(pathId)) {
              originalColors.current.set(
                pathId,
                path.getAttribute("fill") || mapStyle.backgroundColor || "#000000"
              );
            }
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
            const pathId = path.getAttribute("id") || "";
            // Restore original color
            const originalColor =
              originalColors.current.get(pathId) || mapStyle.backgroundColor || "#000000";
            path.setAttribute("fill", originalColor);
            handleMouseLeave();
          }
        }}
      />
    </div>
  );
};
