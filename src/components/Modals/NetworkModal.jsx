// src/components/Modals/NetworkModal.jsx
import React from 'react';

export default function NetworkModal({ networkData, onClose }) {
  if (!networkData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-xl relative">
        {/* ปุ่มปิด */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white shadow-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6L18 18" />
          </svg>
        </button>

        {/* ส่วนหัวภาพหน้าปก */}
        {networkData.imageUrl && (
          <div className="w-full h-64 overflow-hidden">
            <img src={networkData.imageUrl} alt={networkData.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-2">{networkData.name}</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              เครือข่ายระดับจังหวัด
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600 font-medium">ชัยนาท</span> {/* ปรับให้ดึงจาก data ถ้ามี */}
          </div>


          {/* การเสริมสร้างองค์ความรู้ (Markdown) */}
          {networkData.contentHTML && (
            <div className="mb-8 border-b border-gray-100 pb-8 prose prose-lg prose-blue max-w-none">
               
              <div dangerouslySetInnerHTML={{ __html: networkData.contentHTML }} />
            </div>
          )}

          {/* ส่วนข้อมูลยุทธศาสตร์ */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "ภาคียุทธศาสตร์นโยบายระดับท้องถิ่น", content: networkData.strategicPartners },
              { title: "นโยบายระดับท้องถิ่น", content: networkData.localPolicies },
              { title: "ภาคียุทธศาสตร์นโยบายระดับชาติ", content: networkData.nationalPartnerPolicies },
              { title: "ภาคียุทธศาสตร์ระดับชาติ", content: networkData.nationalPartners },
            ].map((section, index) => (
              section.content && (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
                    {section.title}
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              )
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}