import { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. ถ้าไม่มีรูปเลย ให้ซ่อน Component นี้ไปเลย (หรือจะโชว์กล่องเทาๆ ก็ได้)
  if (!images || images.length === 0) {
    return null; 
  }

  // ฟังก์ชันเลื่อนรูป
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mb-6">
    
      
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
        {/* โชว์รูปภาพปัจจุบัน */}
        <img 
          src={images[currentIndex]} 
          alt={`รูปภาพที่ ${currentIndex + 1}`} 
          className="w-full h-full object-cover"
        />

        {/* 2. ถ้ามีรูปมากกว่า 1 รูป ถึงจะโชว์ปุ่มลูกศร */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} className="text-gray-800" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} className="text-gray-800" />
            </button>
            
            {/* จุดไข่ปลาบอกจำนวนรูปด้านล่าง */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 w-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}