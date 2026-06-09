import { useEffect, useRef } from "react";
import L, { type Map } from "leaflet";

type Props = {
  lat: number;
  lng: number;
  titulo?: string;
  height?: number;
};

export function DenunciaDetailMap({ lat, lng, titulo, height = 200 }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await import("leaflet/dist/leaflet.css");
      if (!mounted || !elRef.current) return;

      const map = L.map(elRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
        preferCanvas: true,
      }).setView([lat, lng], 16);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:var(--destructive);border:3px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,0.15)"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([lat, lng], { icon, title: titulo ?? "Local" }).addTo(map);
    })();
    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, titulo]);

  return (
    <div
      ref={elRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-lg border"
    />
  );
}
