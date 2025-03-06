import React from "react";
import { IndiaMap, StateData } from "../dist";

const App: React.FC = () => {
  const stateData: StateData[] = [
    {
      id: "IN-MH",
      customData: {
        name: "Maharashtra",
        capital: "Mumbai",
      },
    },
    {
      id: "IN-DL",
      customData: {
        name: "Delhi",
        capital: "New Delhi",
      },
    },
    {
      id: "IN-TN",
      customData: {
        name: "Tamil Nadu",
        capital: "Chennai",
      },
    },
  ];

  const handleStateHover = (stateId: string, stateInfo?: StateData) => {
    console.log(`Hovering over ${stateId}`, stateInfo);
  };

  const handleStateClick = (stateId: string, stateInfo?: StateData) => {
    console.log(`Clicked on ${stateId}`, stateInfo);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Minimal India Map Test</h1>
      <p>This is a minimal test of the India Map component with tooltip functionality.</p>
      <p>Hover over any state to see the tooltip with state data.</p>

      <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
        <IndiaMap
          stateData={stateData}
          onStateHover={handleStateHover}
          onStateClick={handleStateClick}
        />
      </div>
    </div>
  );
};

export default App;
