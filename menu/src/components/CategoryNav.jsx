import React, { useRef, useEffect } from 'react'

export default function CategoryNav({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}) {
  const scrollContainerRef = useRef(null)

  // Auto scroll the active pill into view
  useEffect(() => {
    if (!scrollContainerRef.current) return
    const activeEl = scrollContainerRef.current.querySelector(`[data-cat-id="${activeCategory}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }, [activeCategory])

  return (
    <div className="sticky top-0 z-30 w-full bg-[#FEEDDE]/95 backdrop-blur-md border-b border-[#D8C2AA] shadow-xs py-2.5 transition-all">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Horizontal Scrolling Pill List */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-1 scroll-smooth"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                data-cat-id={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#2D1C12] text-[#FDF8F3] border-[#2D1C12] shadow-sm scale-102'
                    : 'bg-[#FFFDF9] text-[#6B5E55] border-[#D8C2AA]/80 hover:border-[#BA8A53] hover:text-[#2D1C12]'
                }`}
              >
                <span>{cat.name}</span>
                <span 
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive 
                      ? 'bg-[#BA8A53] text-white' 
                      : 'bg-[#F0DFCD] text-[#7A5A43]'
                  }`}
                >
                  {cat.items.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
