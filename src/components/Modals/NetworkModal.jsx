// src/components/Modals/NetworkModal.jsx
import React from 'react';

// 👇 1. เพิ่มฟังก์ชันแปลงค่ามาตรฐานเป็นป้ายสีและไอคอน 👇
const getStandardTag = (std) => {
  const standardConfig = {
    organic: { 
      label: 'อินทรีย์ / Organic', 
      color: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    },
    gap: { 
      label: 'GAP', 
      color: 'text-blue-700 bg-blue-100 border-blue-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    },
    nakhonpathom_guarantee: { 
      label: 'นครปฐมการันตี', 
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

// 👇 2. อัปเดต Component ProvinceCalendarSection 👇
const ProvinceCalendarSection = ({ allLocations, provinceSlug }) => {
  if (!allLocations || !provinceSlug) return null;

  const locationsInProvince = allLocations.filter(loc => loc.province === provinceSlug);

  const calendarItems = [];
  locationsInProvince.forEach(loc => {
    if (loc.productList) {
      loc.productList.forEach(product => {
        if (product.calendar && Object.values(product.calendar).some(val => val)) {
          calendarItems.push({ location: loc, product: product });
        }
      });
    }
  });

  if (calendarItems.length === 0) return null;

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
    return 'bg-white text-gray-300 border-gray-100';
  };

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        ภาพรวมปฏิทินผลผลิตในจังหวัด
      </h3>

      <div className="flex flex-col gap-4">
        {calendarItems.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors">
            
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-3">
              <div className="flex flex-col items-start gap-1.5">
                
                {/* 👇 แสดงชื่อผลผลิต และ ป้ายมาตรฐานเรียงต่อกัน 👇 */}
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-lg text-gray-900 leading-none">{item.product.name}</h4>
                  
                  {item.product.standards && item.product.standards.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.product.standards.filter(std => std !== 'general').map(std => {
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

                <a 
                  href={`?loc=${item.location.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location.name}
                </a>
              </div>

              {item.product.yieldAmount && (
                <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-medium border border-blue-100 whitespace-nowrap shrink-0">
                  ปริมาณ: {item.product.yieldAmount}
                </span>
              )}
            </div>

            {/* ตาราง 12 เดือน */}
            <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5 mt-2">
              {months.map(m => {
                const status = item.product.calendar[m.id];
                return (
                  <div key={m.id} className={`flex items-center justify-center py-2.5 rounded-md border text-xs sm:text-sm transition-all ${getStatusStyle(status)}`}>
                    {m.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 w-fit">
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#fde047] border border-yellow-400"></span> ช่วงเวลาปลูก</div>
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#86efac] border border-green-400"></span> ช่วงเก็บเกี่ยว</div>
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#16a34a] border border-green-700"></span> ออกผลมากที่สุด (Peak)</div>
         <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm bg-[#fdba74] border border-orange-400"></span> รับผลิตสั่งล่วงหน้า (Pre-Order)</div>
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

            {/* 👇 3. เรียกใช้งาน Component ปฏิทินตรงด้านล่างสุดของเนื้อหา 👇 */}
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