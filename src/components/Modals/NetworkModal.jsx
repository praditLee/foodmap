// src/components/Modals/NetworkModal.jsx
import React, { useState } from 'react';
import { marked } from 'marked';
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

// 👇 Component สำหรับเมนูชูสุขภาพ 👇
const HealthyMenuSection = ({ menus }) => {
  // State สำหรับจำว่าการ์ดไหนกำลังถูกกางอยู่ (เก็บเป็น index)
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!menus || menus.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 7v5l3 3"/>
        </svg>
        เมนูชูสุขภาพจากเครือข่าย
      </h3>

      {/* 🌟 จุดสำคัญ: ใช้ items-start เพื่อไม่ให้การ์ดในแถวเดียวกันยืดตามเวลาเรากางการ์ดใดการ์ดหนึ่ง */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {menus.map((menu, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div key={idx} className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-green-300">
              
              {/* รูปภาพเมนู */}
              {menu.image ? (
                <img src={menu.image} alt={menu.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-green-50 flex items-center justify-center text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}

              <div className="p-5">
                <h4 className="text-xl font-extrabold text-gray-900 mb-2">{menu.name}</h4>
                
                {/* คำโปรย (พับเก็บ = โชว์ 2 บรรทัด, กางออก = โชว์เต็ม) */}
                {menu.introText && (
                  <p 
                    className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    {menu.introText}
                  </p>
                )}

                {/* 👇 ส่วนเนื้อหาที่จะกางออก (สไลด์ลงมาแบบนุ่มนวล) 👇 */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    {/* ใช้ dangerouslySetInnerHTML เพื่อเรนเดอร์ HTML และใช้คลาส prose เพื่อให้ Tailwind จัดหน้าตาให้อัตโนมัติ */}
                    <div 
                      className="pt-4 border-t border-gray-100 text-sm text-gray-700 leading-relaxed prose prose-sm prose-green max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: menu.content ? marked.parse(menu.content, { breaks: true }) : '' 
                      }}
                    />
                  </div>
                </div>

                {/* ปุ่มกดเปิด/ปิด */}
                <button 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-800 transition-colors bg-green-50 px-3 py-1.5 rounded-full"
                >
                  {isExpanded ? (
                    <>ย่อรายละเอียด <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg></>
                  ) : (
                    <>ดูวิธีทำ / ส่วนผสม <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 👇 Component สำหรับแสดงรายชื่อตลาดสีเขียวในจังหวัด 👇
const GreenMarketSection = ({ allLocations, provinceSlug }) => {
  if (!allLocations || !provinceSlug) return null;

  // 1. กรองเอาเฉพาะสถานที่ที่เป็น "ตลาดเขียว (midstream)" และอยู่ในจังหวัดนี้
  const greenMarkets = allLocations.filter(
    loc => loc.province === provinceSlug && loc.supplyChainStage === 'midstream'
  );

  // ถ้าไม่มีตลาดเขียวเลย ให้ซ่อนส่วนนี้ไป
  if (greenMarkets.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          ตลาดสีเขียวในจังหวัด
        </h3>
        <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold border border-teal-200">
          พบ {greenMarkets.length} แห่ง
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {greenMarkets.map((market, idx) => (
          <a 
            key={idx} 
            href={`?loc=${market.slug}`} // ลิงก์ไปเปิดหน้า LocationModal ของตลาดนั้น
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-teal-400 group block relative"
          >
            {/* รูปภาพตลาด */}
            {market.images && market.images.length > 0 ? (
              <div className="w-full h-48 overflow-hidden bg-gray-100">
                <img 
                  src={typeof market.images[0] === 'string' ? market.images[0] : market.images[0].image || market.images[0].src} 
                  alt={market.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-teal-50 flex items-center justify-center text-teal-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            )}

            <div className="p-5">
              <h4 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">
                {market.name}
              </h4>
              
              {market.networkData && (
                <p className="text-sm text-gray-500 mb-3 truncate flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  {market.networkData.name}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-teal-50 flex items-center text-teal-600 text-sm font-bold gap-1">
                <span>ดูรายละเอียดตลาด</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// 👇 อัปเดต Component ProvinceCalendarSection สำหรับนับจำนวนผลผลิต 👇
const ProvinceCalendarSection = ({ allLocations, provinceSlug }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // 🌟 1. สร้าง State สำหรับ Filter (ค่าเริ่มต้นคือ 'all' โชว์ทั้งหมด)
  const [activeFilter, setActiveFilter] = useState('all');

  if (!allLocations || !provinceSlug) return null;

  const locationsInProvince = allLocations.filter(loc => loc.province === provinceSlug);

  // 🌟 2. ตัวเลือกปุ่ม Filter
  const filterOptions = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'rice_crops', label: 'ข้าว/พืชไร่' },
    { id: 'vegetables', label: 'ผักสด' },
    { id: 'fruits', label: 'ผลไม้' },
    { id: 'processed_food', label: 'อาหาร/แปรรูป' }
  ];

  // 🌟 3. ลอจิกจัดกลุ่ม พร้อม กรองข้อมูลตาม Filter
  const groupedCalendars = [];
  locationsInProvince.forEach(loc => {
    const validProducts = loc.productList?.filter(product => {
      const hasCalendar = product.calendar && Object.values(product.calendar).some(val => val);
      // เช็กว่าหมวดหมู่ตรงกับปุ่มที่กดไหม (ถ้าเป็น 'all' ให้ผ่านหมด)
      const matchFilter = activeFilter === 'all' || product.productType === activeFilter;
      
      return hasCalendar && matchFilter;
    }) || [];

    if (validProducts.length > 0) {
      groupedCalendars.push({ location: loc, products: validProducts });
    }
  });

  // ถ้าเปลี่ยน Filter แล้วข้อมูลไม่พอให้พับ ก็รีเซ็ต isExpanded เป็น false กลับไป
  const INITIAL_PRODUCT_COUNT = 3; 
  const totalProducts = groupedCalendars.reduce((sum, group) => sum + group.products.length, 0);
  const hasMore = totalProducts > INITIAL_PRODUCT_COUNT;

  let displayedGroups = [];
  if (isExpanded || !hasMore) {
    displayedGroups = groupedCalendars;
  } else {
    let currentCount = 0;
    for (const group of groupedCalendars) {
      if (currentCount >= INITIAL_PRODUCT_COUNT) break;
      const remainingSpace = INITIAL_PRODUCT_COUNT - currentCount;
      const productsToKeep = group.products.slice(0, remainingSpace);
      displayedGroups.push({ location: group.location, products: productsToKeep });
      currentCount += productsToKeep.length;
    }
  }

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
  // ถ้าไม่มีข้อมูลใน Filter ที่เลือกเลย
  if (groupedCalendars.length === 0 && activeFilter === 'all') return null;
  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        ภาพรวมปฏิทินผลผลิตในจังหวัด
      </h3>
      {/* 🌟 4. เรนเดอร์ปุ่มกด Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar shrink-0">
        {filterOptions.map(opt => (
          <button 
            key={opt.id}
            onClick={() => {
              setActiveFilter(opt.id);
              setIsExpanded(false); // พับเก็บใหม่เมื่อเปลี่ยน Filter
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

      {groupedCalendars.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
          ไม่พบข้อมูลผลผลิตในหมวดหมู่นี้
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative">
          {displayedGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors animate-in fade-in duration-300">
              
              <div className="mb-4 pb-3 border-b border-gray-100">
                <a href={`?loc=${group.location.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg text-blue-700 hover:text-blue-900 hover:underline font-extrabold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {group.location.name}
                </a>
              </div>

              <div className="flex flex-col gap-5 pl-2 md:pl-7 border-l-2 border-gray-100">
                {group.products.map((product, prodIdx) => (
                  <div key={prodIdx} className="flex flex-col">
                    
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-[1.1rem] leading-none">{product.name}</h4>
                        {product.standards && product.standards.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.standards.filter(std => std !== 'general').map(std => {
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
                      {product.yieldAmount && (
                        <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-medium border border-blue-100 whitespace-nowrap shrink-0">
                          ปริมาณ: {product.yieldAmount}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-6 md:grid-cols-12 gap-1 mt-1">
                      {months.map(m => {
                        const status = product.calendar[m.id];
                        return (
                          <div key={m.id} className={`flex items-center justify-center py-0.5 rounded-md border text-[11px] md:text-xs transition-all ${getStatusStyle(status)}`}>
                            {m.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

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
                    ดูปฏิทินเพิ่มเติมอีก {totalProducts - INITIAL_PRODUCT_COUNT} รายการ
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100 w-fit">
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#fde047] border border-yellow-400"></span> ช่วงเวลาปลูก</div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#86efac] border border-green-400"></span> ช่วงเก็บเกี่ยว</div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#16a34a] border border-green-700"></span> ช่วงผลผลิตมากที่สุด</div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#fdba74] border border-orange-400"></span> ผลิตภัณฑ์แปรรูป</div>
      </div>
    </div>
  );
};

// 👇 2. อัปเดตตัวแปรรับค่า (Props) ของ NetworkModal ให้รับ allLocations และ provinceSlug มาด้วย 👇
export default function NetworkModal({ networkData, provinceName, allLocations, provinceSlug, onClose }) {
  if (!networkData) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-full md:rounded-2xl flex flex-col relative overflow-hidden shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-red-50 hover:text-red-600 shadow-md transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6L18 18" /></svg>
        </button>

        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
          {networkData.imageUrl && (
            <div className="w-full h-48 md:h-72 shrink-0 bg-gray-100">
              <img src={networkData.imageUrl} alt={networkData.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-3 leading-tight">
              {networkData.name || 'กลุ่มเครือข่ายขับเคลื่อนอาหารปลอดภัย'}
            </h2>
            <div className="flex items-center gap-2 mb-8">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                เครือข่ายระดับจังหวัด
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 font-medium text-base">
                {provinceName || "ไม่ระบุจังหวัด"}
              </span>
            </div>

            {networkData.contentHTML && (
              <div className="mb-10 border-b border-gray-100 pb-10 prose prose-lg prose-blue max-w-none">
                <div dangerouslySetInnerHTML={{ __html: networkData.contentHTML }} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "ภาคียุทธศาสตร์นโยบายระดับท้องถิ่น", content: networkData.strategicPartners },
                { title: "นโยบายระดับท้องถิ่น", content: networkData.localPolicies },
                { title: "ภาคียุทธศาสตร์นโยบายระดับชาติ", content: networkData.nationalPartnerPolicies },
                { title: "ภาคียุทธศาสตร์ระดับชาติ", content: networkData.nationalPartners },
              ].map((section, index) => (
                section.content && (
                  <div key={index} className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50">
                    <h4 className="text-lg font-bold text-blue-900 mb-3 border-b border-blue-100 pb-2">
                      {section.title}
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                )
              ))}
            </div>
            {/* 1. เมนูชูสุขภาพ (ถ้ามี) */}
            <HealthyMenuSection menus={networkData.healthMenus} />

            {/* 👇 2. เพิ่มรายชื่อตลาดสีเขียวตรงนี้ 👇 */}
            <GreenMarketSection 
              allLocations={allLocations} 
              provinceSlug={provinceSlug} 
            />

            {/* 3. ปฏิทินผลผลิตรวมของจังหวัด */}
            <ProvinceCalendarSection 
              allLocations={allLocations} 
              provinceSlug={provinceSlug} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}