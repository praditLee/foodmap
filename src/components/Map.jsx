import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- ส่วนแก้ปัญหา icon ของ Leaflet ใน React (บั๊กยอดฮิต) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// -------------------------------------------------------

export default function Map({ locations }) {
  // พิกัดกึ่งกลาง (ประมาณรอยต่อสุพรรณ-นครปฐม)
  const centerPosition = [14.25, 100.15]; 

  return (
    <div className="h-[500px] w-full relative z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={9} // เลขยิ่งมากยิ่งซูมใกล้ (ลองปรับเป็น 8 หรือ 10 ดูครับ)
        scrollWheelZoom={true} 
        className="h-full w-full rounded-lg shadow-lg"
      >
        {/* ลายแผนที่ (ใช้ OpenStreetMap ฟรี) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* วนลูปสร้าง Marker ตามข้อมูลที่ส่งมา */}
        {locations.map((loc) => (
          <Marker 
            key={loc.slug} 
            position={[loc.coordinates.lat, loc.coordinates.lng]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{loc.title}</h3>
                <p className="text-gray-600">{loc.province}</p>
                <a href={`/locations/${loc.slug}`} className="text-blue-500 underline">
                  ดูรายละเอียด
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}