import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type MapPoint = {
  slug: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
};

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

export default function LeafletMap({
  points,
  activeSlug,
  onSelect,
}: {
  points: MapPoint[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const active = points.find((p) => p.slug === activeSlug) ?? points[0]!;

  return (
    <MapContainer
      center={[active.lat, active.lng]}
      zoom={10}
      scrollWheelZoom={false}
      className="h-[420px] w-full lg:h-full lg:min-h-[460px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo lat={active.lat} lng={active.lng} />
      {points.map((p) => {
        const isActive = p.slug === activeSlug;
        return (
          <CircleMarker
            key={p.slug}
            center={[p.lat, p.lng]}
            radius={isActive ? 12 : 8}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: isActive ? "#e11d2f" : "#16a34a",
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => onSelect(p.slug),
              mouseover: () => onSelect(p.slug),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} permanent={isActive}>
              <span className="text-xs font-semibold">{p.title}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
