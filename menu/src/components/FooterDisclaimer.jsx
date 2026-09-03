import React from 'react'

export default function FooterDisclaimer() {
  return (
    <footer className="w-full mt-16 bg-[#3F342D] text-[#F9F5F0] border-t-2 border-[#BA8A53]/50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center space-y-3">
        {/* Exact authoritative legal & service note from PDF */}
        <p className="text-xs sm:text-sm font-sans font-normal tracking-wide text-[#E8DDCF] leading-relaxed">
          Govt. Taxes as applicable. We levy 7% service charge. <span className="hidden sm:inline">|</span> <span className="block sm:inline mt-1 sm:mt-0">Please let us know if you have any food allergies or special requirements.</span>
        </p>

        <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#A69485] font-display uppercase tracking-widest">
          <span>Cherrie Berry</span>
          <span>•</span>
          <span>Farm To Table</span>
          <span>•</span>
          <span>Coonoor</span>
        </div>
      </div>
    </footer>
  )
}
