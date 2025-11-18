import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      <p className="mt-4 text-slate-400 text-lg">กำลังวิเคราะห์ข้อมูล... กรุณารอสักครู่</p>
    </div>
  );
};

export default Loader;
