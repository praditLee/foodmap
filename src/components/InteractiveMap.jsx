import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap, Pin } from '@vis.gl/react-google-maps';
import LocationModal from './Modals/LocationModal';
import NetworkModal from './Modals/NetworkModal';
// 👇 1. ตัวหลัก (ตัวแม่) ทำหน้าที่ครอบ APIProvider อย่างเดียว 👇
export default function InteractiveMap({ allLocations, allNetworks }) {
  return (
    <APIProvider apiKey="AIzaSyBhokyQyee-LgnTpq17EkiYHmevY252S9E"
    language="th"  // 👈 บังคับให้เมนู ป้ายชื่อสถานที่ และชื่อถนนเป็นภาษาไทย
      region="TH"    // 👈 ตั้งค่าพื้นที่อ้างอิงเป็นประเทศไทย
    >
      {/* ส่งข้อมูลต่อไปให้ตัวลูกทำงาน */}
      <MapContent allLocations={allLocations} allNetworks={allNetworks} />
    </APIProvider>
  );
}

// 👇 2. ตัวเนื้อหา (ตัวลูก) ทำหน้าที่คุมแผนที่และรายชื่อฝั่งขวา 👇
function MapContent({ allLocations, allNetworks }) {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalLocation, setModalLocation] = useState(null);
  // 🔥 State สำหรับระบบ Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStage, setActiveStage] = useState('all'); // all, upstream, midstream, downstream, partner
  const [activeProvince, setActiveProvince] = useState('all'); // all, chainat, suphanburi, nakhonpathom, nonthaburi
  // 🔥 เปิดใช้งานจอยควบคุมแผนที่ด้วยคำสั่งนี้
  const map = useMap();
  const defaultCenter = { lat: 14.5, lng: 100.1 };
  // สร้าง State เก็บค่า Zoom (ตั้งค่าเริ่มต้นไว้ที่ 8)
  const [currentZoom, setCurrentZoom] = useState(8);
  const [mobileView, setMobileView] = useState('map');
  
  // State สำหรับควบคุม Toast และ Modal เครือข่าย
  const [activeProvinceSlug, setActiveProvinceSlug] = useState(null); // เก็บค่า slug เช่น 'chainat'
  const [showNetworkModal, setShowNetworkModal] = useState(false); // ควบคุมการเปิด Modal เต็มจอ

  // ตัวแปลภาษาไทยสำหรับจังหวัดในลิสต์ฝั่งขวา
  const provinceNames = {
    'chainat': 'ชัยนาท',
    'suphanburi': 'สุพรรณบุรี',
    'nakhonpathom': 'นครปฐม',
    'nonthaburi': 'นนทบุรี'
  };

  // ฟังก์ชันช่วยเหลือสำหรับเรียกชื่อไทย
  const getProvinceThai = (slug) => {
    if (!slug) return "ไม่ระบุจังหวัด";
    return provinceNames[slug.toLowerCase()] || slug;
  };

  // 🔄 useEffect ตัวที่ 1: จัดการคำนวณ Zoom ตามขนาดหน้าจอมือถือ/คอม (ทำงานตอนโหลดครั้งแรก)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentZoom(8); // หน้าจอมือถือ ซูมออกกว้างหน่อยให้เห็นครบ
      } else {
        setCurrentZoom(9); // หน้าจอคอมพิวเตอร์ ปกติ
      }
    };

    handleResize(); // ให้ทำงานทันทีที่โหลดหน้าเว็บ

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🎨 useEffect ตัวที่ 2: จัดการระบายสี 4 จังหวัด เมื่อแผนที่ (map) พร้อมทำงาน
  useEffect(() => {
    if (!map) return;

    // ดึง Layer ระดับจังหวัด
    const featureLayer = map.getFeatureLayer(window.google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1);

    // 🎨 ส่วนที่ 1: เงื่อนไขระบายสี (เตรียมช่องว่างไว้ใส่รหัส)
    featureLayer.style = (options) => {
      const pId = options.feature.placeId;

      // 🟠 สีส้ม: ชัยนาท
      if (pId === 'ChIJIRWw6IqY4TARoEgIsFT7BAE') {
        return { fillColor: '#FDBA74', fillOpacity: 0.6, strokeColor: '#EA580C', strokeWeight: 2 };
      }
      // 🟢 สีเขียว: สุพรรณบุรี
      if (pId === 'ChIJ7Yh-0iuI4TARlYmRmbPHbBg') {
        return { fillColor: '#86EFAC', fillOpacity: 0.6, strokeColor: '#16A34A', strokeWeight: 2 };
      }
      // 🟡 สีเหลือง: นครปฐม
      if (pId === 'ChIJ0YjsB-zl4jARAWLcuPG-8JY') {
        return { fillColor: '#FDE047', fillOpacity: 0.6, strokeColor: '#CA8A04', strokeWeight: 2 };
      }
      // 🟣 สีม่วง: นนทบุรี
      if (pId === 'ChIJO6t2z8CE4jARpO5V399Gdpg') {
        return { fillColor: '#D8B4FE', fillOpacity: 0.6, strokeColor: '#9333EA', strokeWeight: 2 };
      }

      // 👇 ทริคแก้บั๊ก: ให้จังหวัดอื่นๆ เป็นสีขาวที่โปร่งใส 99% (มองไม่เห็น แต่จิ้มได้)
      return { fillColor: '#FFFFFF', fillOpacity: 0.01, strokeOpacity: 0 };
    };
    // === 🖱️ ส่วนที่ 2: ดักจับการคลิกเพื่อไปเปลี่ยน Filter ฝั่งขวา ===

    // กำหนดพิกัดและระดับการซูมของแต่ละจังหวัด
    const provinceCamera = {
      'chainat': { lat: 14.9500, lng: 100.0251, zoom: 9.8 }, // ปรับพิกัดชัยนาท
      'suphanburi': { lat: 14.3000, lng: 99.8817, zoom: 8.8 }, // ปรับพิกัดสุพรรณบุรี
      'nakhonpathom': { lat: 13.7000, lng: 100.0371, zoom: 9.5 }, // ปรับพิกัดนครปฐม
      'nonthaburi': { lat: 13.8500, lng: 100.3800, zoom: 10.2 } // ปรับพิกัดนนทบุรี
    };

    const clickListener = featureLayer.addListener('click', (e) => {
      if (!e.features || e.features.length === 0) {
        handleResetView();
        return;
      }

      const pId = e.features[0].placeId;
      let selectedProv = 'all';
      if (pId === 'ChIJIRWw6IqY4TARoEgIsFT7BAE') selectedProv = 'chainat'; 
      else if (pId === 'ChIJ7Yh-0iuI4TARlYmRmbPHbBg') selectedProv = 'suphanburi';
      else if (pId === 'ChIJ0YjsB-zl4jARAWLcuPG-8JY') selectedProv = 'nakhonpathom';
      else if (pId === 'ChIJO6t2z8CE4jARpO5V399Gdpg') selectedProv = 'nonthaburi';
      setActiveProvince(selectedProv);

      if (selectedProv !== 'all') {
        // 1. สั่งแผนที่ซูมเข้าไปตรงพิกัดใหม่ที่ปรับชดเชยแล้ว
        const cam = provinceCamera[selectedProv];
        map.panTo({ lat: cam.lat, lng: cam.lng });
        map.setZoom(cam.zoom);

        // 2. เซ็ตค่าให้ Toast โผล่ขึ้นมา (ส่งแค่ชื่อ slug ไปพอ)
        setActiveProvinceSlug(selectedProv);
      } else {
        handleResetView();
        setActiveProvinceSlug(null);
      }
    });
    // === 🧹 ส่วนที่ 3: Cleanup คืนหน่วยความจำเวลาปิดหน้าเว็บ ===
    return () => {
      clickListener.remove();
    };
  }, [map]);

  // 🔗 ดักจับ URL Parameter เพื่อเปิด Modal ทันทีเมื่อคลิกลิงก์แชร์มา
  useEffect(() => {
    // 1. อ่านค่า URL ปัจจุบัน
    const urlParams = new URLSearchParams(window.location.search);
    const sharedLocSlug = urlParams.get('loc');

    if (sharedLocSlug && allLocations && allLocations.length > 0) {
      // 2. ค้นหาสถานที่ที่ตรงกับ slug ที่ได้จากลิงก์
      const sharedPlace = allLocations.find(loc => loc.slug === sharedLocSlug);

      if (sharedPlace) {
        // 3. ถ้าเจอ ให้ตั้งค่า State เพื่อเปิด Modal
        setModalLocation(sharedPlace);

        // 4. (ทางเลือก) สั่งให้แผนที่ซูมไปหาพิกัดนั้นด้วยเลย
        const latVal = parseFloat(sharedPlace.lat || sharedPlace?.coordinates?.lat);
        const lngVal = parseFloat(sharedPlace.lng || sharedPlace?.coordinates?.lng);
        if (map && !isNaN(latVal) && !isNaN(lngVal)) {
          map.panTo({ lat: latVal, lng: lngVal });
          map.setZoom(12);
        }
        
        // 5. ปรับให้เปลี่ยนหน้าจอมือถือเป็น 'map' เพื่อให้แสดง Modal ซ้อนทับได้ถูกต้อง
        setMobileView('map');
      }
    }
  }, [allLocations, map]); // ให้ทำงานเมื่อข้อมูลสถานที่พร้อม หรือ แผนที่โหลดเสร็จ

  // 🎯 ฟังก์ชันสำหรับกดแล้วให้แผนที่วิ่งไปหาพิกัดสถานที่
  // 🎯 ฟังก์ชันสำหรับกดแล้วให้แผนที่วิ่งไปหาพิกัดสถานที่
  const handlePlaceSelect = (loc) => {
    // 👇 ดึงพิกัด
    const latVal = parseFloat(loc.lat || loc?.coordinates?.lat);
    const lngVal = parseFloat(loc.lng || loc?.coordinates?.lng);

    if (!isNaN(latVal) && !isNaN(lngVal)) {
      // ✅ กรณีที่ 1: "มีพิกัด" -> โชว์ป้ายบนแผนที่ และซูมเข้าไป
      setSelectedPlace(loc); 
      if (map) {
        map.panTo({ lat: latVal, lng: lngVal });
        map.setZoom(11); 
      } 
      setMobileView('map');
    } else {
      // ✅ กรณีที่ 2: "ไม่มีพิกัด" -> ไม่ต้องพยายามโชว์บนแผนที่ ให้เด้ง Modal หน้าต่างรายละเอียดขึ้นมาเลย!
      setModalLocation(loc);
    }
  };
  // 🔄 ฟังก์ชันปุ่ม "ดูภาพรวม 4 จังหวัด" (Reset View)
  const handleResetView = () => {
    setSelectedPlace(null);
    setActiveProvinceSlug(null);
    setShowNetworkModal(false);
    setActiveProvince('all');
    if (map) {
      map.panTo(defaultCenter);
      map.setZoom(currentZoom);
    }
  };
  // 🧠 โลจิกการกรองข้อมูล (Filter)
  const filteredLocations = allLocations.filter(loc => {
    // 1. กรองด้วยคำค้นหา (ชื่อสถานที่)
    const matchSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. กรองด้วยประเภท (ต้นน้ำ, กลางน้ำ, ...)
    const matchStage = activeStage === 'all' || loc.supplyChainStage === activeStage;
    
    // 3. กรองด้วยจังหวัด
    // สมมติว่าในข้อมูลมี loc.province เช่น 'chainat', 'suphanburi'
    const matchProvince = activeProvince === 'all' || loc.province === activeProvince;

    return matchSearch && matchStage && matchProvince;
  });

  // 🔍 ค้นหาข้อมูลเครือข่ายอย่างปลอดภัย (ป้องกัน Error)
  const currentNetworkItem = allNetworks?.find(net => {
    // ดึงค่า province ออกมา โดยเช็คเผื่อโครงสร้างทั้ง 2 แบบ
    const prov = net?.data?.province || net?.province;
    return prov === activeProvinceSlug;
  });

  // แกะเอาข้อมูลออกมาใช้งาน
  const currentNetworkData = currentNetworkItem?.data || currentNetworkItem || null;

  return (
    <div className="flex flex-col w-full">
      
      {/* 🌟 ส่วนหัว: สลับระหว่างข้อความปกติ กับ Toast เครือข่าย */}
      <div className="mb-4 h-20 flex flex-col justify-center">
        
          <div className="animate-in fade-in duration-300">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">แผนที่เครือข่ายอาหารปลอดภัย</h1>
            {!activeProvinceSlug ? (
              <p className="text-sm lg:text-base text-gray-600">คลิกที่จังหวัดเพื่อดูรายชื่อสถานที่</p>
            ) : (
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300 w-full lg:w-2/3">
            <div>
              <p className="text-sm lg:text-base text-gray-600">
                จังหวัด{getProvinceThai(activeProvinceSlug)}
              </p>
            </div>
            {currentNetworkData ? (
              <button 
                onClick={() => setShowNetworkModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm"
              >
                อ่านรายละเอียด
              </button>
            ) : (
              <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                ยังไม่มีข้อมูล
              </span>
            )}
          </div>
          
        )}
        </div>
      </div>
  
    <div className="flex flex-col lg:flex-row gap-6 h-[800px] pb-16 lg:pb-0 relative">
      
      {/* 🗺️ โซนแผนที่ (ฝั่งซ้าย) */}
      <div className={`w-full lg:w-2/3 h-[calc(100vh-180px)] lg:h-full rounded-2xl overflow-hidden shadow-md border border-gray-200 relative ${mobileView === 'map' ? 'block' : 'hidden lg:block'}`}>

        {/* ปุ่มดูภาพรวมเดิม */}
        <button 
          onClick={handleResetView}
          className={`absolute left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg top-4 shadow-md border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition flex items-center gap-2
      
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          ดูภาพรวม 4 จังหวัด
        </button>

        <Map
          defaultZoom={currentZoom}
          defaultCenter={defaultCenter}
          mapId="af65c5cc1deac49962f15548"
          disableDefaultUI={true}
          zoomControl={true}
          clickableIcons={false}
        >
          {/* วาดหมุดเฉพาะที่ผ่านการ Filter เท่านั้น */}
          {filteredLocations.map((loc) => {
            const latVal = parseFloat(loc.lat || loc?.coordinates?.lat);
            const lngVal = parseFloat(loc.lng || loc?.coordinates?.lng);
            if (!isNaN(latVal) && !isNaN(lngVal)) {
              return (
                <AdvancedMarker 
                  key={loc.id || loc.slug} 
                  position={{ lat: latVal, lng: lngVal }} 
                  onClick={() => handlePlaceSelect(loc)}
                >
                  <Pin />
                </AdvancedMarker>
              );
            }
            return null;
          })}

          {selectedPlace && (
            <InfoWindow
              position={{ 
                lat: parseFloat(selectedPlace.lat || selectedPlace?.coordinates?.lat), 
                lng: parseFloat(selectedPlace.lng || selectedPlace?.coordinates?.lng) 
              }}
              pixelOffset={[0, -40]} 
              // 👇 1. ท่าไม้ตาย: สั่งปิด Header และปุ่ม X ของ Google ทิ้งไปเลย!
              headerDisabled={true} 
            >
              {/* เปลี่ยนเป็นกล่องที่ไม่มีกรอบ และให้ซ่อนสิ่งที่ล้นออกไป (overflow-hidden) */}
              <div className="w-[260px] flex flex-col relative bg-white rounded-xl overflow-hidden">
                
                {/* 👇 2. สร้างปุ่ม X ของเราเอง ลอยทับอยู่บนมุมขวาของรูปภาพ */}
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-2 right-2 z-50 bg-white/90 text-gray-800 p-1.5 rounded-full hover:bg-red-50 hover:text-red-600 shadow-md transition flex items-center justify-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6L18 18" />
                  </svg>
                </button>

                {/* 🖼️ โซนรูปภาพ (ตอนนี้จะดันขึ้นไปชนขอบบน 100% แล้ว) */}
                {selectedPlace.images?.[0] && (
                  <img 
                    src={selectedPlace.images[0]} 
                    alt={selectedPlace.name} 
                    className="w-full h-40 object-cover shrink-0 m-0 block" 
                  />
                )}

                {/* 📝 โซนเนื้อหา */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold text-[15px] text-[#1e293b] mb-1 leading-snug">
                    {selectedPlace.name}
                  </h3>
                  
                  {/* ที่อยู่ และ จังหวัด (ปรับเป็น items-start ตามที่คุณเขียนมา ถูกต้องแล้วครับ) */}
                  {selectedPlace.contacts?.map((contact, idx) => {
                    if (contact.type === 'address') {
                      return (
                        <p key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="shrink-0 text-base">🏠</span> 
                          <span>{contact.value} จ.{getProvinceThai(selectedPlace.province)}</span>
                        </p>
                      );
                    }
                    return null;
                  })}

                  {/* เบอร์โทรศัพท์ */}
                  {selectedPlace.contacts?.map((contact, idx) => {
                    if (contact.type === 'phone') {
                      return (
                        <p key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="shrink-0 text-base">📞</span> 
                          <span>{contact.value}</span>
                        </p>
                      );
                    }
                    return null;
                  })}

                  {/* ปุ่มดูรายละเอียด */}
                  <button 
                    onClick={() => setModalLocation(selectedPlace)} 
                    className="mt-3 bg-[#1e293b] text-white text-[15px] py-2.5 rounded-lg font-medium hover:bg-gray-900 w-full transition-colors shadow-sm cursor-pointer"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* 📋 โซนรายชื่อและเครื่องมือกรอง (ฝั่งขวา) */}
      {/* 👇 เพิ่มเงื่อนไข: มือถือโชว์ตอน mobileView === 'list', ส่วนคอม (lg) โชว์เสมอ (lg:flex) */}
      <div className={`w-full lg:w-1/3 h-[calc(100vh-180px)] lg:h-full flex-col bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}`}>
        {/* ส่วนหัวเครื่องมือกรอง (Sticky) */}
        <div className="p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-gray-800">กลุ่มขับเคลื่อน</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">{filteredLocations.length} แห่ง</span>
          </div>

          {/* 1. ค้นหาชื่อ */}
          <input 
            type="text" 
            placeholder="🔍 ค้นหาชื่อสถานที่..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 2. กรองจังหวัด (Dropdown) */}
          <select 
            value={activeProvince}
            onChange={(e) => setActiveProvince(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทุกจังหวัด (ภาพรวม)</option>
            <option value="chainat">ชัยนาท</option>
            <option value="suphanburi">สุพรรณบุรี</option>
            <option value="nakhonpathom">นครปฐม</option>
            <option value="nonthaburi">นนทบุรี</option>
          </select>

          {/* 3. กรองประเภท (Pills) */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'upstream', label: 'ผู้ผลิต' },
              { id: 'midstream', label: 'ตลาดเขียว' },
              // { id: 'downstream', label: 'ผู้บริโภค' },
              { id: 'partner', label: 'ภาคี' },
            ].map(stage => (
              <button 
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${activeStage === stage.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {/* รายชื่อสถานที่ (Scroll ได้) */}
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          <div className="flex flex-col gap-3">
            {filteredLocations.length > 0 ? (
              filteredLocations.map(loc => (
                <div 
                  key={loc.id || loc.slug}
                  onClick={() => handlePlaceSelect(loc)}
                  className={`p-4 bg-white rounded-xl shadow-sm border cursor-pointer hover:border-green-500 transition-all ${selectedPlace?.slug === loc.slug ? 'border-green-500 ring-1 ring-green-500 bg-green-50/10' : 'border-gray-200'}`}
                >
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{loc.name}</h4>
                  <p className="text-xs text-gray-500">จ.{getProvinceThai(loc.province)}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10 text-sm">ไม่พบสถานที่ที่ค้นหา</div>
            )}
          </div>
        </div>
      </div>

      {/* 👇 ปุ่ม Toggle ด้านล่างสุด แสดงเฉพาะบนมือถือ (lg:hidden) 👇 */}
      <div className="fixed bottom-0 left-0 w-full z-[1000] lg:hidden">
        {mobileView === 'map' ? (
          <button 
            onClick={() => {
              setMobileView('list');
              setActiveProvinceSlug(null); // 👈 เพิ่มบรรทัดนี้: ปิด Toast เครือข่ายทิ้งทันที
              setShowNetworkModal(false); // 👈 เพิ่มบรรทัดนี้: ปิด Modal เครือข่ายทิ้งทันที
            }}
            className="w-full bg-[#5A5A5A] hover:bg-gray-700 text-white py-4 font-medium text-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            แสดงรายชื่อ
          </button>
        ) : (
          <button 
            onClick={() => setMobileView('map')}
            className="w-full bg-[#5A5A5A] hover:bg-gray-700 text-white py-4 font-medium text-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
            แสดงแผนที่
          </button>
        )}
      </div>

      {/* Modal สถานที่ */}
      {modalLocation && <LocationModal locationData={modalLocation} onClose={() => setModalLocation(null)} />}
      
      {/* 👇 แก้ไข Modal เครือข่ายตรงนี้ ส่ง networkData เข้าไปให้ตรงชื่อ 👇 */}
      {showNetworkModal && currentNetworkData && (
        <NetworkModal 
          networkData={currentNetworkData} 
          provinceName={getProvinceThai(activeProvinceSlug)}
          onClose={() => setShowNetworkModal(false)} 
        />
      )}
    </div>
    </div>
  );
}