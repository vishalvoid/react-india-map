

export interface TooltipConfig {
  backgroundColor: string;
  textColor: string;
}

export interface MapStyle {
  backgroundColor: string;
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
    [key: string]: string | number;
  };
  [key: string]: any;
}

export interface IndiaMapProps {
  mapStyle?: MapStyle;
  stateData?: StateData[];
  onStateClick?: (stateId: string, stateName: string) => void;
  onStateHover?: (stateName: string) => void;
}

export const defaultMapStyle: MapStyle = {
  backgroundColor: "#ffffff",
  hoverColor: "#A5A5A5",
  stroke: "#000000",
  strokeWidth: 1,
  tooltipConfig: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
};

export type SVGElementRef = SVGSVGElement | null;
