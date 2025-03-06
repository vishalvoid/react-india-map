import React, { useState } from "react";
import { IndiaMap, StateData, MapStyle } from "../dist";

const TestComponent: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string>("");
  const [clickedState, setClickedState] = useState<string>("");

  // Define map style configurations
  const mapStyle: MapStyle = {
    backgroundColor: "#f8f8f8",
    hoverColor: "#c8e1ff",
    stroke: "#000000",
    strokeWidth: 1,
    tooltipConfig: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      textColor: "#ffffff",
    },
  };

  // Define some sample state data
  const stateData: StateData[] = [
    {
      id: "IN-MH",
      customData: {
        population: "123.2 million",
        capital: "Mumbai",
        gdp: "$400 billion",
      },
    },
    {
      id: "IN-DL",
      customData: {
        population: "20.5 million",
        capital: "New Delhi",
        gdp: "$110 billion",
      },
    },
    {
      id: "IN-TN",
      customData: {
        population: "72.1 million",
        capital: "Chennai",
        gdp: "$250 billion",
      },
    },
  ];

  // Define event handlers
  const handleStateHover = (stateId: string, stateInfo?: StateData) => {
    setHoveredState(stateId);
    console.log(`Hovering over ${stateId}`, stateInfo?.customData);
  };

  const handleStateClick = (stateId: string, stateInfo?: StateData) => {
    setClickedState(stateId);
    console.log(`Clicked ${stateId}`, stateInfo?.customData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>India Map Component Test</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          test component
          <IndiaMap
            mapStyle={mapStyle}
            stateData={stateData}
            onStateHover={handleStateHover}
            onStateClick={handleStateClick}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>Component State</h2>
          <div>
            <p>
              <strong>Hovered State:</strong> {hoveredState || "None"}
            </p>
            <p>
              <strong>Clicked State:</strong> {clickedState || "None"}
            </p>
          </div>
          <h2>State Data</h2>
          {stateData.map((state) => (
            <div
              key={state.id}
              style={{
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: state.id === hoveredState ? "#f0f0f0" : "white",
              }}
            >
              <h3>{state.id}</h3>
              <div>
                {state.customData &&
                  Object.entries(state.customData).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {value}
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
