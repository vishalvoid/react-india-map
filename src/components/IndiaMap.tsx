import React, { useState, useEffect } from "react";
import { fetchSVGContent } from "../utils/mapUtils";
import { IndiaMapProps, StateData } from "../types/MapTypes";

interface HoverInfo {
  name: string;
  id: string;
  title: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  mapStyle = {
    backgroundColor: "#ffffff",
    hoverColor: "#e0e0e0",
    tooltipConfig: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      textColor: "#ffffff",
    },
  },
  stateData = [],
  onStateHover,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadSVG = async () => {
      const content = await fetchSVGContent();
      if (content) {
        setSvgContent(content);
      }
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
      onStateHover(stateName);
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
      onStateHover("");
    }
  };

  const getStateData = (stateId: string) => {
    return stateData.find((data) => data.id === stateId);
  };

  return (
    <div className="india-map-container" onMouseMove={handleMouseMove}>
      {hoverInfo && (
        <div
          className="state-tooltip"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y + 10}px`,
            position: "fixed",
            backgroundColor: mapStyle.tooltipConfig?.backgroundColor,
            color: mapStyle.tooltipConfig?.textColor,
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          <div>State: {hoverInfo.name}</div>
          <div>ID: {hoverInfo.id}</div>
          <div>Title: {hoverInfo.title}</div>
          {getStateData(hoverInfo.id)?.customData && (
            <div className="custom-data">
              {Object.entries(getStateData(hoverInfo.id)!.customData!).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
            </div>
          )}
        </div>
      )}
      <div
        style={{ backgroundColor: mapStyle.backgroundColor }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onMouseOver={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            path.style.fill = mapStyle.hoverColor || "#e0e0e0";
            handleMouseEnter(e as any, path);
          }
        }}
        onMouseOut={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            path.style.fill = mapStyle.backgroundColor || "#ffffff";
          }
          handleMouseLeave();
        }}
      />
    </div>
  );
};
