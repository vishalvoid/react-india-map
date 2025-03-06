import { ReactElement } from "react";

export interface IndiaMapProps {
  fillColor?: string;
  hoverColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  onStateClick?: (stateName: string) => void;
  customStateStyles?: { [key: string]: React.CSSProperties };
  defaultSelectedState?: string;
}

export function IndiaMap(props: IndiaMapProps): ReactElement;
