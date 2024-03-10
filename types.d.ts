export interface BCCConfig {
  font_size: number;
  font_color: string;
  background_alpha: number;
  background_color: string;
  Stroke: string;
  body: {
    from: number;
    to: number;
    location: number;
    content: string;
  }[];
}

export interface SRTConfig {
  [index: string]: {
    from: string;
    to: string;
    content: string;
  };
}

export interface BCUTClip {
  inPoint: number,
  outPoint: number, 
  AssetInfo: Record<string, any>
}