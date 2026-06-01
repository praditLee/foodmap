// src/components/Modals/NetworkModal.jsx
import React from 'react';

export default function NetworkModal({ networkData, provinceName, onClose }) {
  if (!networkData) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      
      {/* กล่อง Modal */}
      <div className="bg-white w-full max-w-7xl h-full md:rounded-2xl flex flex-col relative overflow-hidden shadow-2xl">
        
        {/* ปุ่มปิด */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-red-50 hover:text-red-600 shadow-md transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6L18 18" /></svg>
        </button>

        {/* พื้นที่เนื้อหาที่เลื่อนได้ */}
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

          </div>
        </div>
      </div>
    </div>
  );
}