export interface TooltipConfig {
  backgroundColor?: string;
  textColor?: string;
}

export interface MapStyle {
  backgroundColor?: string;
  hoverColor?: string;
  tooltipConfig?: TooltipConfig;
  stroke?: string;
  strokeWidth?: number;
}

export interface CustomData {
  [key: string]: unknown;
}

export interface StateData {
  id: string;
  customData?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface IndiaMapProps {
  mapStyle?: MapStyle;
  stateData?: StateData[];
  onStateClick?: (stateId: string, stateInfo?: StateData) => void;
  onStateHover?: (stateId: string, stateInfo?: StateData) => void;
}

export const defaultMapStyle: MapStyle = {
  backgroundColor: "#ffffff",
  hoverColor: "#e0e0e0",
  stroke: "#000000",
  strokeWidth: 1,
  tooltipConfig: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    textColor: "#ffffff",
  },
};

export type SVGElementRef = SVGSVGElement | null;
