// src/components/Modals/LocationModal.jsx
import React, { useState } from 'react';
import { Navigation } from 'lucide-react';
import ImageGallery from '../ImageGallery';

// ฟังก์ชันช่วยเหลือสำหรับกำหนดสไตล์ ชื่อ และ "ไอคอน" ของมาตรฐาน
const getStandardTag = (std) => {
  const standardConfig = {
    pgs: { 
      label: 'PGS', 
      color: 'text-green-700 bg-green-100 border-green-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
    },
    organic_thailand: { 
      label: 'Organic Thailand', 
      color: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    },
    gap: { 
      label: 'GAP (ปลอดภัย)', 
      color: 'text-blue-700 bg-blue-100 border-blue-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    },
    fda_otop: { 
      label: 'อย./ มผช./ OTOP', 
      color: 'text-orange-700 bg-orange-100 border-orange-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    },
    general: { 
      label: 'ทั่วไป', 
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    },
  };
  return standardConfig[std] || standardConfig.general;
};

// ฟังก์ชันช่วยเหลือสำหรับกำหนดสไตล์ของประเภทห่วงโซ่
const getSupplyChainTag = (stage) => {
  const stageMap = {
    upstream: { label: 'ต้นน้ำ (การผลิต)', color: 'bg-teal-50 text-teal-700' },
    midstream: { label: 'กลางน้ำ (ตลาด/แปรรูป)', color: 'bg-amber-50 text-amber-700' },
    downstream: { label: 'ปลายน้ำ (ผู้บริโภค)', color: 'bg-rose-50 text-rose-700' },
    partner: { label: 'หน่วยงานภาคี', color: 'bg-indigo-50 text-indigo-700' },
  };
  return stageMap[stage] || { label: stage, color: 'bg-gray-100 text-gray-700' };
};

export default function LocationModal({ locationData, onClose, onNetworkClick }) {
  const [selectedProductImage, setSelectedProductImage] = useState(null);

  if (!locationData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const supplyChainTag = getSupplyChainTag(locationData.supplyChainStage);
  const usedStandards = locationData.productList 
    ? Array.from(new Set(locationData.productList.flatMap(item => item.standards || [])))
        .filter(std => std !== 'general')
    : [];
  // ฟังก์ชันสำหรับ Copy เบอร์โทร
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`คัดลอก "${text}" เรียบร้อยแล้ว!`); 
  };
  const handleShare = () => {
    // สร้าง URL แบบเต็มๆ พร้อมแนบ ?loc=slug ไปด้วย
    const shareUrl = `${window.location.origin}${window.location.pathname}?loc=${locationData.slug}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`คัดลอกลิงก์สำหรับแชร์เรียบร้อยแล้ว!\nนำไปส่งต่อได้เลยครับ`); 
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl z-[1500] w-full max-w-6xl h-full overflow-y-auto shadow-xl relative">
        {/* ปุ่มปิด */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white shadow-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6L18 18" />
          </svg>
        </button>

        {/* แกลเลอรีรูปภาพ */}
        <div className="w-full h-60 overflow-hidden bg-gray-200">
          {locationData.images && locationData.images.length > 0 ? (
             <ImageGallery images={locationData.images} />
          ) : (
             <img 
               src="/images/default-cover.webp"
               alt={locationData.name} 
               className="w-full h-full object-cover"
             />
          )}
        </div>

        <div className="p-7">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                {locationData.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${supplyChainTag.color}`}>
                  {supplyChainTag.label}
                </span>
                
                {/* 👇 ปุ่มแชร์ที่เพิ่มเข้ามาใหม่ 👇 */}
                {locationData.slug && (
                  <button 
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    แชร์สถานที่นี้
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* สังกัดเครือข่าย */}
          {locationData.networkData && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>สังกัดเครือข่าย:</span>
              <button 
                onClick={() => onNetworkClick(locationData.networkData)}
                className="font-semibold text-blue-700 hover:text-blue-900 hover:underline transition"
              >
                {locationData.networkData.name}
              </button>
            </div>
          )}

          {/* ข้อมูลทั่วไป (Markdown) */}
          {locationData.contentHTML && (
            <div className="mb-8 border-b border-gray-100 pb-8 prose prose-blue prose-sm max-w-none">
              <h3 className="text-xl font-bold text-gray-800 mb-3">ข้อมูลการดำเนินงาน</h3>
              <div dangerouslySetInnerHTML={{ __html: locationData.contentHTML }} />
            </div>
          )}

          {/* 👇 ส่วนแสดงผลผลิตภัณฑ์และไอคอนแบบใหม่ 👇 */}
          {locationData.productList && locationData.productList.length > 0 && (
            <div className="mb-8 border-b border-gray-100 pb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ผลผลิต / ผลิตภัณฑ์</h3>
              
              <div className="flex flex-wrap gap-x-4 gap-y-4 mt-2">
                {locationData.productList.map((item, index) => (
                  <button 
                    key={`prod-${index}`} 
                    onClick={() => item.productImage && setSelectedProductImage(item.productImage)}
                    className={`relative flex flex-col justify-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 min-w-[130px] text-center shadow-sm ${item.productImage ? 'hover:border-blue-300 hover:bg-blue-50 cursor-pointer' : 'cursor-default'}`} 
                  >
                    <span className="font-semibold text-gray-800 text-base">{item.name}</span>
                    
                    {item.productImage && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-1 right-1 h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}

                    {/* แสดงไอคอนมาตรฐาน (แบบวงกลมเล็กๆ มุมขวาบน) */}
                    {item.standards && item.standards.length > 0 && (
                      <div className="absolute -top-2 -right-2 flex flex-row flex-wrap justify-end gap-1 z-10">
                        {item.standards
                          .filter(std => std !== 'general')
                          .map((std) => {
                            const tag = getStandardTag(std);
                            return (
                              <div 
                                key={`std-${std}`} 
                                className={`flex items-center justify-center w-6 h-6 rounded-full border shadow-sm bg-white ${tag.color}`}
                                title={tag.label} // เอาเมาส์ชี้แล้วมีชื่อบอก
                              >
                                {tag.icon}
                              </div>
                            );
                        })}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* 👇 คำอธิบายสัญลักษณ์ (Legend) แสดงเฉพาะที่มีในหน้านั้น 👇 */}
              {usedStandards.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">คำอธิบายสัญลักษณ์:</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {usedStandards.map(std => {
                      const tag = getStandardTag(std);
                      return (
                        <div key={`legend-${std}`} className="flex items-center gap-1.5">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border bg-white ${tag.color}`}>
                            {tag.icon}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{tag.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* 👆 สิ้นสุดส่วนแสดงผลผลิต 👆 */}

          {/* ช่องทางการสื่อสารแบบใหม่ */}
          {locationData.contacts && locationData.contacts.length > 0 && (
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                ช่องทางการสื่อสาร
              </h4>
              
              <div className="flex flex-col gap-3">
                {locationData.contacts.map((contact, idx) => {
                  if (contact.type === 'phone') {
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{contact.label || 'เบอร์โทรศัพท์'}</span>
                          <a href={`tel:${contact.value.replace(/\s+/g, '')}`} className="text-gray-900 font-medium md:hidden hover:text-blue-600">
                            {contact.value}
                          </a>
                          <span className="text-gray-900 font-medium hidden md:inline">
                            {contact.value}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleCopy(contact.value)}
                          className="hidden md:flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          คัดลอก
                        </button>
                      </div>
                    );
                  }

                  if (contact.type === 'link') {
                    return (
                      <a key={idx} href={contact.value} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 hover:bg-blue-50/30 transition group">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{contact.label || 'เว็บไซต์ / Facebook'}</span>
                          <span className="text-blue-600 font-medium group-hover:underline truncate max-w-[250px] sm:max-w-xs">{contact.value}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    );
                  }

                  if (contact.type === 'line') {
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">{contact.label || 'Line ID'}</span>
                          <span className="text-gray-900 font-medium">{contact.value}</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(contact.value)}
                          className="flex items-center gap-1 text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-md transition"
                        >
                          คัดลอก ID
                        </button>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          )}

          {/* ปุ่ม Google Maps แก้ไขให้เป็น URL ที่ถูกต้อง */}
          {locationData.coordinates && locationData.coordinates.lat && locationData.coordinates.lng && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${locationData.coordinates.lat},${locationData.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-fit"
            >
              <Navigation className="w-4 h-4" />
              นำทาง (Google Maps)
            </a>
          )}
        </div>
      </div>

      {/* 👇 Light Box สำหรับแสดงรูปภาพผลิตภัณฑ์ขนาดใหญ่ 👇 */}
      {selectedProductImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => {
             e.stopPropagation(); 
             setSelectedProductImage(null);
          }} 
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <button 
              onClick={() => setSelectedProductImage(null)}
              className="absolute -top-10 -right-0 md:-right-10 text-white hover:text-gray-300 p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6L18 18" />
              </svg>
            </button>
            <img 
              src={selectedProductImage} 
              alt="รูปภาพผลผลิต" 
              className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
}