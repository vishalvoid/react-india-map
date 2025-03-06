#!/usr/bin/env node
const fs = require("fs");
const https = require("https");

// You'll need to replace this URL with a valid source for the India map SVG
const SVG_MAP_URL =
  "https://raw.githubusercontent.com/vishalvoid/react-india-map/main/public/india.svg";

console.log("Fetching India map SVG...");

https
  .get(SVG_MAP_URL, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      // Create utils directory if it doesn't exist
      if (!fs.existsSync("./src/utils")) {
        fs.mkdirSync("./src/utils", { recursive: true });
      }

      // Format the SVG as a JavaScript string
      const svgString = data.replace(/(\r\n|\n|\r)/gm, "").replace(/"/g, '\\"');

      // Create the mapUtils.ts file with the SVG content
      const mapUtilsContent = `
// This file is auto-generated. Do not edit directly.
export const INDIA_SVG_MAP = "${svgString}";

export const fetchSVGContent = async (): Promise<string> => {
  // Return the SVG content directly
  return INDIA_SVG_MAP;
};

export const getEventTarget = (event: any): Element | null => {
  return event.target;
};
`;

      fs.writeFileSync("./src/utils/mapUtils.ts", mapUtilsContent.trim());
      console.log("Map SVG fetched and stored in src/utils/mapUtils.ts");
    });
  })
  .on("error", (err) => {
    console.error("Error fetching SVG map:", err.message);
  });
