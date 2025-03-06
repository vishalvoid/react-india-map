import React, { useState } from "react";
import { IndiaMap } from "./components/IndiaMap";
import { StateData } from "./types/MapTypes";

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<string>("");

  // Sample state data with custom information
  const sampleStateData: StateData[] = [
    {
      id: "IN-MH",
      customData: {
        population: "123.2M",
        capital: "Mumbai",
        gdp: "$400B",
      },
    },
    {
      id: "IN-DL",
      customData: {
        population: "20.5M",
        capital: "New Delhi",
        gdp: "$110B",
      },
    },
  ];

  // Custom map styling
  const mapStyle = {
    backgroundColor: "#000000",
    hoverColor: "#dddddd",
    tooltipConfig: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      textColor: "#ffffff",
    },
  };

  const handleStateHover = (stateName: string) => {
    setActiveState(stateName);
    console.log(`Hovering over: ${stateName}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <IndiaMap mapStyle={mapStyle} stateData={sampleStateData} onStateHover={handleStateHover} />
      </div>
      {activeState && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          Currently hovering: <strong>{activeState}</strong>
        </div>
      )}
    </div>
  );
};

export default App;
