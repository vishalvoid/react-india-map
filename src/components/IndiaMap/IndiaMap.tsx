import React, { useState, useEffect } from "react";
import { IndiaMapProps, StateData } from "../../types/MapTypes";
import { fetchSVGContent } from "../../utils/mapUtils";

interface HoverInfo {
  name: string;
  id: string;
  title: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  mapStyle = {
    hoverColor: "#e0e0e0",
  },
  stateData = [],
  onStateHover,
  onStateClick,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadSVG = async () => {
      const content = await fetchSVGContent();
      if (content) setSvgContent(content);
    };
    loadSVG();
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, element: SVGPathElement) => {
    const stateName = element.getAttribute("data-name") || "";
    const pathId = element.getAttribute("id") || "";
    const pathTitle = element.getAttribute("title") || "";

    setHoverInfo({ name: stateName, id: pathId, title: pathTitle });
    setTooltipPos({ x: e.clientX, y: e.clientY });

    if (onStateHover) {
      // @ts-ignore
      const stateInfo = stateData.find((state) => state.id === pathId);
      // @ts-ignore
      onStateHover(pathId, stateInfo);
    }
  };

  const handleClick = (e: React.MouseEvent, element: SVGPathElement) => {
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

  const handleMouseLeave = (element: SVGPathElement) => {
    setHoverInfo(null);
    if (onStateHover) {
      // @ts-ignore
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
            // @ts-ignorey
            path.style.fill = mapStyle.hoverColor;
            handleMouseEnter(e, path);
          }
        }}
        onClick={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            handleClick(e, path);
          }
        }}
        onMouseOut={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            path.style.fill = "";
            handleMouseLeave(path);
          }
        }}
      />
    </div>
  );
};
