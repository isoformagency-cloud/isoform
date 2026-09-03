import React from 'react'

export default function MenuItem({ item, isHighlighted }) {
  const hasOptions = item.priceOptions && item.priceOptions.length > 0

  return (
    <article 
      id={`item-${item.id}`}
      className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 ${
        isHighlighted
          ? 'bg-[#BA8A53]/20 ring-2 ring-[#BA8A53] shadow-md'
          : 'hover:bg-[#F7EEE3]/60 hover:shadow-xs'
      }`}
    >
      {/* Top row: Item Name + Dotted Leader + Price */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
        <div className="flex items-baseline min-w-0 pr-2">
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D1C12] leading-snug tracking-tight group-hover:text-[#8B5024] transition-colors">
            {item.name}
          </h3>
        </div>

        {/* Dotted leader on desktop/tablet */}
        <div className="hidden sm:block dotted-leader"></div>

        {/* Price display */}
        {!hasOptions ? (
          <div className="flex-shrink-0 pt-0.5 sm:pt-0">
            <span className="font-price font-semibold text-sm sm:text-base text-[#9E5E28] tracking-tight bg-[#FBF1E6] sm:bg-transparent px-2.5 py-0.5 sm:p-0 rounded-md border border-[#E8D4C0] sm:border-0 inline-block">
              {item.price}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 mt-1 sm:mt-0 flex-shrink-0">
            {item.priceOptions.map((opt, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4E4D3] text-xs font-price text-[#4A3222] border border-[#DFC3A6]"
              >
                <span className="font-sans font-medium text-[#73523A]">{opt.label}:</span>
                <strong className="font-semibold text-[#9E5E28]">{opt.price}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description row (if present in PDF) */}
      {item.description && (
        <p className="mt-1 text-xs sm:text-sm text-[#66574D] font-sans leading-relaxed italic">
          ({item.description})
        </p>
      )}
    </article>
  )
}
