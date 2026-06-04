declare module "leaflet" {
  export interface LeafletMouseEvent {
    latlng: { lat: number; lng: number };
  }

  export interface Map {
    remove(): void;
    setView(
      center: [number, number] | { lat: number; lng: number },
      zoom: number,
      options?: { animate?: boolean },
    ): this;
    getZoom(): number;
    on(type: "click", handler: (e: LeafletMouseEvent) => void): this;
  }

  export interface Marker {
    setLatLng(latlng: [number, number]): this;
    getLatLng(): { lat: number; lng: number };
    addTo(map: Map): this;
    bindPopup(html: string): this;
    openPopup(): this;
  }

  export interface TileLayer {
    addTo(map: Map): this;
  }

  interface LeafletStatic {
    map(element: HTMLElement, options?: Record<string, unknown>): Map;
    marker(latlng: [number, number], options?: Record<string, unknown>): Marker;
    tileLayer(url: string, options?: Record<string, unknown>): TileLayer;
  }

  const L: LeafletStatic;
  export default L;
}

declare module "leaflet/dist/leaflet.css" {
  const content: string;
  export default content;
}
