import React from 'react'
import MenuItem from './MenuItem'

export default function MenuSection({ category, highlightedItemId }) {
  return (
    <section
      id={`cat-${category.id}`}
      data-section-id={category.id}
      className="scroll-mt-20 my-6 sm:my-10"
    >
      <div className="menu-frame rounded-2xl p-4 sm:p-7 md:p-8 transition-shadow">
        {/* Category Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-5 border-b-2 border-[#BA8A53]/30">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D1C12] tracking-tight">
              {category.name}
            </h2>
            <span className="text-xs font-mono text-[#8C6B4E] bg-[#F7EFE6] px-2.5 py-0.5 rounded-full border border-[#DFC8B2]">
              {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="text-[11px] uppercase tracking-widest text-[#9C734B] font-display">
            Original Menu • Page {category.page}
          </div>
        </div>

        {/* 2-Column Responsive Item Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4">
          {category.items.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isHighlighted={highlightedItemId === item.id} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
