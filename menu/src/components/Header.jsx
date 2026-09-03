import React, { useState } from 'react'
import { Search, Compass, Utensils, Coffee, Sparkles } from 'lucide-react'

export default function Header({ 
  activeSection, 
  setActiveSection, 
  onOpenSearch, 
  onOpenDrawer,
  totalItemsCount,
  foodCount,
  bevCount
}) {
  return (
    <header className="relative w-full pt-8 pb-4 px-4 sm:px-6 lg:px-8 border-b border-[#D8C2AA]/60 bg-[#FEEDDE] bg-subtle-grain transition-colors">
      {/* Brand Arch Badge directly inspired by PDF Cover */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Farm to Table Illustration Badge */}
        <div className="inline-flex flex-col items-center mb-3">
          <div className="flex items-center gap-2 text-[#BA8A53] tracking-[0.25em] text-[11px] uppercase font-display font-semibold mb-1">
            <span className="h-px w-6 bg-[#BA8A53]/50"></span>
            <span>Farm To Table</span>
            <span className="h-px w-6 bg-[#BA8A53]/50"></span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D1C12] font-bold tracking-tight mb-1">
            CHERRIE BERRY
          </h1>

          <div className="flex items-center gap-3 text-[#966731] tracking-[0.3em] text-[11px] uppercase font-medium">
            <span>Coonoor</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#BA8A53]"></span>
            <span>estd. 2022</span>
          </div>
        </div>

        {/* Action Controls & Search Trigger */}
        <div className="w-full mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#BA8A53]/25">
          {/* Section Filter Pills */}
          <nav aria-label="Menu section switcher" className="flex items-center gap-1.5 bg-[#F3E4D4]/80 p-1 rounded-full border border-[#D8C2AA]">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                activeSection === 'all'
                  ? 'bg-[#BA8A53] text-white shadow-sm font-semibold'
                  : 'text-[#5C4535] hover:text-[#2D1C12] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Menu</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'all' ? 'bg-white/25 text-white' : 'bg-[#E5D2BE] text-[#5C4535]'}`}>
                {totalItemsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('food')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                activeSection === 'food'
                  ? 'bg-[#BA8A53] text-white shadow-sm font-semibold'
                  : 'text-[#5C4535] hover:text-[#2D1C12] hover:bg-white/50'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'food' ? 'bg-white/25 text-white' : 'bg-[#E5D2BE] text-[#5C4535]'}`}>
                {foodCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('beverages')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                activeSection === 'beverages'
                  ? 'bg-[#BA8A53] text-white shadow-sm font-semibold'
                  : 'text-[#5C4535] hover:text-[#2D1C12] hover:bg-white/50'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Beverages</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'beverages' ? 'bg-white/25 text-white' : 'bg-[#E5D2BE] text-[#5C4535]'}`}>
                {bevCount}
              </span>
            </button>
          </nav>

          {/* Search & Drawer Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              aria-label="Search menu items"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#5C4535] hover:text-[#2D1C12] border border-[#D8C2AA] shadow-xs text-xs sm:text-sm transition-all hover:border-[#BA8A53]"
            >
              <Search className="w-3.5 h-3.5 text-[#BA8A53]" />
              <span className="hidden sm:inline">Search items...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#FEEDDE] text-[#8C6442] rounded border border-[#D8C2AA]">
                /
              </kbd>
            </button>

            <button
              onClick={onOpenDrawer}
              aria-label="Open categories directory"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#BA8A53]/15 hover:bg-[#BA8A53]/25 text-[#7E4B1E] border border-[#BA8A53]/40 text-xs sm:text-sm font-medium transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#BA8A53]" />
              <span>Index</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
