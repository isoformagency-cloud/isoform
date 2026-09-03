import React, { useEffect } from 'react'
import { X, BookOpen, Utensils, Coffee, ChevronRight } from 'lucide-react'

export default function CategoryDrawer({ 
  isOpen, 
  onClose, 
  sections, 
  activeCategory, 
  onSelectCategory 
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#FFFDF9] h-full shadow-2xl border-l border-[#D8C2AA] z-10 flex flex-col transform transition-transform duration-300 ease-out">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#D8C2AA] bg-[#FEEDDE]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#BA8A53]" />
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2D1C12]">
              Menu Directory
            </h3>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-full text-[#6B5E55] hover:text-[#2D1C12] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Categorized lists */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1 border-b border-[#BA8A53]/30">
                {section.id === 'food' ? (
                  <Utensils className="w-4 h-4 text-[#BA8A53]" />
                ) : (
                  <Coffee className="w-4 h-4 text-[#BA8A53]" />
                )}
                <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-[#8A5F35]">
                  {section.title}
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {section.categories.map((cat) => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id)
                        onClose()
                      }}
                      className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-[#2D1C12] text-[#FDF8F3] shadow-xs'
                          : 'hover:bg-[#FEEDDE] text-[#4A3222]'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-serif font-semibold text-xs sm:text-sm leading-snug">
                          {cat.name}
                        </span>
                        <span className={`text-[10px] font-sans ${isActive ? 'text-[#D8C2AA]' : 'text-[#8A7A6E]'}`}>
                          Menu Page {cat.page}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-[#BA8A53] text-white' : 'bg-[#EBD8C4] text-[#694424]'
                        }`}>
                          {cat.items.length}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#BA8A53]' : 'text-[#BA8A53]/60'}`} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-[#D8C2AA] bg-[#FEEDDE]/60 text-center">
          <p className="text-xs text-[#7A695D] font-serif">
            Cherrie Berry Coonoor • 19 Categories
          </p>
        </div>
      </div>
    </div>
  )
}
