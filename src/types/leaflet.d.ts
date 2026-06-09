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
    on(type: string, handler: (e: LeafletMouseEvent) => void): this;
    fitBounds(bounds: unknown, options?: Record<string, unknown>): this;
    addLayer(layer: unknown): this;
    removeLayer(layer: unknown): this;
    hasLayer(layer: unknown): boolean;
    invalidateSize(): this;
  }

  export interface Marker {
    setLatLng(latlng: [number, number]): this;
    getLatLng(): { lat: number; lng: number };
    addTo(map: Map): this;
    bindPopup(html: string, options?: Record<string, unknown>): this;
    bindTooltip(html: string, options?: Record<string, unknown>): this;
    openPopup(): this;
    on(type: string, handler: (e: unknown) => void): this;
  }

  export interface TileLayer {
    addTo(map: Map): this;
  }

  export interface DivIcon {}
  export interface LatLngBounds {}
  export interface LayerGroup {
    addLayer(layer: unknown): this;
    addTo(map: Map): this;
    clearLayers(): this;
  }

  interface LeafletStatic {
    map(element: HTMLElement, options?: Record<string, unknown>): Map;
    marker(
      latlng: [number, number] | { lat: number; lng: number },
      options?: Record<string, unknown>,
    ): Marker;
    tileLayer(url: string, options?: Record<string, unknown>): TileLayer;
    divIcon(options: Record<string, unknown>): DivIcon;
    latLngBounds(latlngs: Array<[number, number]>): LatLngBounds;
    layerGroup(): LayerGroup;
    markerClusterGroup?: (opts?: Record<string, unknown>) => LayerGroup;
    heatLayer?: (
      latlngs: Array<[number, number, number?]>,
      opts?: Record<string, unknown>,
    ) => { addTo(map: Map): unknown };
  }

  const L: LeafletStatic;
  export default L;
}

declare module "leaflet/dist/leaflet.css" {
  const content: string;
  export default content;
}

declare module "leaflet.markercluster" {
  const _default: unknown;
  export default _default;
}
declare module "leaflet.markercluster/dist/MarkerCluster.css" {
  const content: string;
  export default content;
}
declare module "leaflet.markercluster/dist/MarkerCluster.Default.css" {
  const content: string;
  export default content;
}
declare module "leaflet.heat" {
  const _default: unknown;
  export default _default;
}
