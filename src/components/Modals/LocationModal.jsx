// src/components/Modals/LocationModal.jsx
import React, { useState } from 'react';
import { Navigation } from 'lucide-react';
import ImageGallery from '../ImageGallery';

// ฟังก์ชันช่วยเหลือสำหรับกำหนดสไตล์ ชื่อ และ "ไอคอน" ของระบบการผลิต
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
      label: 'GAP', 
      color: 'text-blue-700 bg-blue-100 border-blue-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    },
    fda_otop: { 
      label: 'อย./ มผช./ OTOP', 
      color: 'text-orange-700 bg-orange-100 border-orange-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    },
    // 👇 เพิ่มค่าใหม่ 4 ตัวด้านล่างนี้ 👇
    natural: {
      label: 'ธรรมชาติ',
      color: 'text-lime-700 bg-lime-100 border-lime-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 12 2l10 20-10-4Z"/></svg>
    },
    self_guarantee: {
      label: 'อินทรีย์รับรองตนเอง',
      color: 'text-teal-700 bg-teal-100 border-teal-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    },
    np_guarantee: {
      label: 'นครปฐมการันตี',
      color: 'text-rose-700 bg-rose-100 border-rose-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v5s3 0 3-5M9 15v5s-3 0-3-5"/><circle cx="12" cy="9" r="6"/></svg>
    },
    homemade: {
      label: 'เกษตรครัวเรือน',
      color: 'text-amber-700 bg-amber-100 border-amber-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
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
    upstream: { label: 'ผู้ผลิต', color: 'bg-teal-50 text-teal-700' },
    midstream: { label: 'ตลาดเขียว', color: 'bg-green-50 text-green-700' },
    downstream: { label: 'ปลายน้ำ (ผู้บริโภค)', color: 'bg-rose-50 text-rose-700' },
    partner: { label: 'หน่วยงานภาคี', color: 'bg-indigo-50 text-indigo-700' },
  };
  return stageMap[stage] || { label: stage, color: 'bg-gray-100 text-gray-700' };
};

export default function LocationModal({ locationData, onClose, onNetworkClick }) {

  if (!locationData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const supplyChainTag = getSupplyChainTag(locationData.supplyChainStage);

// 👇 อัปเดต Component SeasonalCalendarSection (เพิ่ม Filter + พับเก็บ) 👇
const SeasonalCalendarSection = ({ products }) => {
  // 1. สร้าง State สำหรับ พับเก็บ และ Filter
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const activeProducts = products || [];
  if (activeProducts.length === 0) return null;

  // 2. ตัวเลือกปุ่ม Filter
  const filterOptions = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'rice_crops', label: 'ข้าว/พืชไร่' },
    { id: 'vegetables', label: 'ผักสด' },
    { id: 'fruits', label: 'ผลไม้' },
    { id: 'processed_food', label: 'อาหาร/แปรรูป' }
  ];

  // 3. กรองข้อมูลผลผลิตตาม Filter และเช็กว่ามีข้อมูลที่จะแสดงไหม
  const filteredProducts = activeProducts.filter(product => {
    // เช็กว่ามีข้อมูลปริมาณ หรือ มีข้อมูลปฏิทินอย่างน้อย 1 เดือน
    const hasData = product.yieldAmount || (product.calendar && Object.values(product.calendar).some(val => val));
    // เช็กว่าหมวดหมู่ตรงกับ Filter ที่กดไหม
    const matchFilter = activeFilter === 'all' || product.productType === activeFilter;
    
    return hasData && matchFilter;
  });

  // ถ้าไม่มีผลผลิตเลยตั้งแต่แรก (ตอนเป็น 'all') ก็ซ่อน Component นี้ไปเลย
  if (filteredProducts.length === 0 && activeFilter === 'all') return null;

  // 4. ลอจิกการตัดแบ่งข้อมูลเพื่อซ่อน/แสดง (พับเก็บ)
  const INITIAL_PRODUCT_COUNT = 3; 
  const hasMore = filteredProducts.length > INITIAL_PRODUCT_COUNT;
  
  // ถ้ากางออก ให้ดึงมาทั้งหมด ถ้าพับอยู่ ให้ slice มาแค่จำนวนเริ่มต้น
  const displayedProducts = isExpanded ? filteredProducts : filteredProducts.slice(0, INITIAL_PRODUCT_COUNT);

  const months = [
    { id: 'jan', name: 'ม.ค.' }, { id: 'feb', name: 'ก.พ.' }, { id: 'mar', name: 'มี.ค.' },
    { id: 'apr', name: 'เม.ย.' }, { id: 'may', name: 'พ.ค.' }, { id: 'jun', name: 'มิ.ย.' },
    { id: 'jul', name: 'ก.ค.' }, { id: 'aug', name: 'ส.ค.' }, { id: 'sep', name: 'ก.ย.' },
    { id: 'oct', name: 'ต.ค.' }, { id: 'nov', name: 'พ.ย.' }, { id: 'dec', name: 'ธ.ค.' }
  ];

  const getStatusStyle = (status) => {
    if (status === 'planting') return 'bg-[#fde047] text-yellow-900 border-yellow-400 font-medium';
    if (status === 'harvest') return 'bg-[#86efac] text-green-900 border-green-400 font-medium';
    if (status === 'peak') return 'bg-[#16a34a] text-white border-green-700 font-bold shadow-sm';
    if (status === 'pre-order') return 'bg-[#fdba74] text-orange-900 border-orange-400 font-medium';
    return 'bg-gray-50 text-gray-300 border-gray-100';
  };

  return (
    <div className="mb-8 border-b border-gray-100 pb-8 animate-in fade-in duration-500">
      
      {/* ส่วนหัว และ ปุ่ม Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          ผลผลิต / ผลิตภัณฑ์ และปฏิทินฤดูกาล
        </h3>
        
        {/* เรนเดอร์ปุ่มกด Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar shrink-0">
          {filterOptions.map(opt => (
            <button 
              key={opt.id}
              onClick={() => {
                setActiveFilter(opt.id);
                setIsExpanded(false); // เมื่อเปลี่ยน Filter ให้พับเก็บกลับไปค่าเริ่มต้นเสมอ
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === opt.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* ถ้ากด Filter แล้วไม่เจอข้อมูลเลย ให้แสดงข้อความ */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
          ไม่พบข้อมูลผลผลิตในหมวดหมู่นี้
        </div>
      ) : (
        <div className="flex flex-col gap-4 relative">
          
          {/* เรนเดอร์ผลผลิตที่ผ่านการกรองและตัดแบ่งแล้ว */}
          {displayedProducts.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-green-300 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-3">
                <div className="flex flex-col items-start gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-lg text-gray-900 leading-none">{item.name}</h4>
                    {item.standards && item.standards.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.standards.filter(std => std !== 'general').map(std => {
                          const tag = getStandardTag(std);
                          return (
                            <span key={std} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border shadow-sm ${tag.color}`}>
                              {tag.icon} {tag.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {item.yieldAmount && (
                  <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-medium border border-blue-100 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                    ปริมาณ: {item.yieldAmount}
                  </span>
                )}
              </div>

              {item.calendar && Object.values(item.calendar).some(v => v) && (
                <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5 mt-2">
                  {months.map(m => {
                    const status = item.calendar[m.id];
                    return (
                      <div key={m.id} className={`flex items-center justify-center py-2.5 rounded-md border text-xs sm:text-sm transition-all ${getStatusStyle(status)}`}>
                        {m.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* ปุ่มกดดูเพิ่มเติม อัปเดตข้อความให้นับตามจำนวนผลผลิตที่เหลือ */}
          {hasMore && (
            <div className={`flex justify-center mt-2 ${!isExpanded ? 'relative -top-4 pt-12 bg-gradient-to-t from-white via-white/90 to-transparent' : ''}`}>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-full border border-blue-200 transition-all shadow-sm hover:shadow"
              >
                {isExpanded ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                    ย่อปฏิทินให้สั้นลง
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    ดูเพิ่มเติมอีก {filteredProducts.length - INITIAL_PRODUCT_COUNT} รายการ
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      )}

      {/* คำอธิบายสัญลักษณ์สี */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100 w-fit">
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#fde047] border border-yellow-400"></span> ช่วงเวลาปลูก</div>
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#86efac] border border-green-400"></span> ช่วงเก็บเกี่ยว</div>
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#16a34a] border border-green-700"></span> ช่วงผลผลิตมากที่สุด</div>
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#fdba74] border border-orange-400"></span> ผลิตภัณฑ์แปรรูป</div>
      </div>
    </div>
  );
};
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
      <div className="bg-white rounded-2xl z-[1500] w-full max-w-6xl h-full overflow-y-auto hide-scrollbar shadow-xl relative">
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
        <div className="w-full h-80 overflow-hidden bg-gray-200">
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
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">
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
            <div className="top-12 mb-8 border-b border-gray-100 pb-8 prose prose-blue prose-sm max-w-none">
              <h3 className="text-md font-bold text-gray-800 mb-3">ข้อมูลการดำเนินงาน</h3>
              <div dangerouslySetInnerHTML={{ __html: locationData.contentHTML }} />
            </div>
          )}


          {/* 👇 เรียกใช้ Component ปฏิทินฤดูกาล (มันจะซ่อนตัวเองถ้าไม่มีข้อมูล) 👇 */}
          <SeasonalCalendarSection products={locationData.productList} />

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
                   if (contact.type === 'address') {
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">{contact.label || 'ที่อยู่'}</span>
                          <span className="text-gray-900 font-medium">{contact.value}</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(contact.value)}
                          className="flex items-center gap-1 text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-md transition"
                        >
                          คัดลอกที่อยู่
                        </button>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          )}

          {/* ปุ่ม Google Maps แก้ไข URL ให้ถูกต้อง และดึงพิกัดแบบครอบคลุม */}
          {(locationData.lat || locationData?.coordinates?.lat) && (locationData.lng || locationData?.coordinates?.lng) && (
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${locationData.lat || locationData.coordinates.lat},${locationData.lng || locationData.coordinates.lng}`}
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

    </div>
  );
}