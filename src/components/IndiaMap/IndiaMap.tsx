import React, { useState, useEffect, useRef } from "react";
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
    backgroundColor: "#ffffff",
    stroke: "#000000",
    strokeWidth: 1,
    tooltipConfig: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      textColor: "#ffffff",
    },
  },
  stateData = [],
  onStateHover,
  onStateClick,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

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
            pathElement.setAttribute("fill", mapStyle.backgroundColor || "#ffffff");
            pathElement.setAttribute("stroke", mapStyle.stroke || "#000000");
            pathElement.setAttribute("stroke-width", String(mapStyle.strokeWidth || 1));

            // Store original color (which is now the background color)
            originalColors.current.set(id, mapStyle.backgroundColor || "#ffffff");
          });
        }
      }, 100);
    }
  }, [svgContent, mapStyle.backgroundColor, mapStyle.stroke, mapStyle.strokeWidth]);

  const handleMouseEnter = (e: React.MouseEvent, element: SVGPathElement) => {
    const stateName = element.getAttribute("data-name") || "";
    const pathId = element.getAttribute("id") || "";
    const pathTitle = element.getAttribute("title") || "";

    setHoverInfo({ name: stateName, id: pathId, title: pathTitle });
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);

    if (onStateHover) {
      const stateInfo = stateData.find((state) => state.id === pathId);
      onStateHover(pathId, stateInfo);
    }
  };

  const handleClick = (pathId: string) => {
    if (onStateClick) {
      const stateInfo = stateData.find((state) => state.id === pathId);
      onStateClick(pathId, stateInfo);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showTooltip) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
    setShowTooltip(false);

    if (onStateHover) {
      onStateHover("", undefined);
    }
  };

  const currentStateData: StateData | undefined = hoverInfo
    ? stateData.find((state) => state.id === hoverInfo.id)
    : undefined;

  // Function to determine tooltip display
  const shouldDisplayTooltip = () => {
    return showTooltip && hoverInfo && currentStateData?.customData;
  };

  // Get tooltip styles
  const getTooltipStyles = () => {
    return {
      position: "fixed" as const,
      left: `${tooltipPos.x + 15}px`,
      top: `${tooltipPos.y + 15}px`,
      backgroundColor: mapStyle.tooltipConfig?.backgroundColor || "rgba(0, 0, 0, 0.8)",
      color: mapStyle.tooltipConfig?.textColor || "#ffffff",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      zIndex: 1000,
      pointerEvents: "none" as const,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      minWidth: "150px",
      maxWidth: "250px",
    };
  };

  // Get tooltip header styles
  const getTooltipHeaderStyles = () => {
    return {
      fontWeight: "bold" as const,
      marginBottom: "5px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      paddingBottom: "5px",
    };
  };

  // Get tooltip row styles
  const getTooltipRowStyles = () => {
    return {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginBottom: "3px",
    };
  };

  return (
    <div
      className="india-map-container"
      onMouseMove={handleMouseMove}
      style={{ position: "relative", width: "100%" }}
    >
      {/* Built-in tooltip that will be displayed on hover */}
      {shouldDisplayTooltip() && (
        <div className="state-tooltip" style={getTooltipStyles()}>
          <div style={getTooltipHeaderStyles()}>
            {hoverInfo?.title || currentStateData?.customData?.name || hoverInfo?.id}
          </div>

          {currentStateData?.customData && (
            <div>
              {Object.entries(currentStateData.customData).map(
                ([key, value]) =>
                  key !== "name" && (
                    <div key={key} style={getTooltipRowStyles()}>
                      <span style={{ fontWeight: "bold", textTransform: "capitalize" as const }}>
                        {key}:
                      </span>
                      <span>{String(value)}</span>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      )}

      <div
        ref={mapContainerRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: "100%", height: "100%" }}
        onMouseOver={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            // Apply hover color
            path.setAttribute("fill", mapStyle.hoverColor || "#e0e0e0");
            handleMouseEnter(e, path);
          }
        }}
        onClick={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            const pathId = path.getAttribute("id") || "";
            handleClick(pathId);
          }
        }}
        onMouseOut={(e) => {
          const path = e.target as SVGPathElement;
          if (path.tagName === "path") {
            // Restore original color (background color)
            path.setAttribute("fill", mapStyle.backgroundColor || "#ffffff");
          }
          handleMouseLeave();
        }}
      />

      {/* Add default CSS styles for the map */}
      <style>{`
        .india-map-container {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }
        
        .india-map-container path {
          transition: fill 0.3s ease, stroke 0.3s ease;
          cursor: pointer;
        }
        
        .india-map-container path:hover {
          stroke-width: ${(mapStyle.strokeWidth || 1) * 1.5}px;
        }
        
        .state-tooltip {
          transition: opacity 0.2s;
        }
      `}</style>
    </div>
  );
};
