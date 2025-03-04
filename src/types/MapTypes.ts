export interface TooltipConfig {
  backgroundColor: string;
  textColor: string;
}

export interface MapStyle {
  backgroundColor: string;
  hoverColor: string;
  tooltipConfig?: TooltipConfig;
  stroke?: string;
  strokeWidth?: number;
}

export interface CustomData {
  [key: string]: unknown;
}

export interface StateData {
  id: string;
  customData?: CustomData;
}

export interface IndiaMapProps {
  mapStyle?: Partial<MapStyle>;
  stateData?: StateData[];
  onStateClick?: (stateCode: string, stateName: string, customData?: CustomData) => void;
  onStateHover?: (stateCode: string, stateName: string, customData?: CustomData) => void;
}

export const defaultMapStyle: MapStyle = {
  backgroundColor: "#D6D6D6",
  hoverColor: "#A5A5A5",
  stroke: "#000000",
  strokeWidth: 1,
  tooltipConfig: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
};

export type SVGElementRef = SVGSVGElement | null;
