import React from 'react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A1B]">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/30"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-violet-500"></div>
    </div>
  );
};

export default Loader;
