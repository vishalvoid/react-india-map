import { CSSProperties } from "react";

export interface TooltipConfig {
  backgroundColor: string;
  textColor: string;
}

export interface MapStyle {
  backgroundColor: string;
  hoverColor: string;
  tooltipConfig?: TooltipConfig;
}

export interface StateData {
  id: string;
  customData?: {
    [key: string]: string | number;
  };
}

export interface IndiaMapProps {
  mapStyle?: MapStyle;
  stateData?: StateData[];
  onStateHover?: (stateName: string) => void;
  onStateClick?: (stateId: string, stateName: string) => void;
}

export declare const IndiaMap: React.FC<IndiaMapProps>;
