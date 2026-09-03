import React, { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react'

export default function SearchModal({ 
  isOpen, 
  onClose, 
  allCategories, 
  onSelectItem 
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Flatten all items with category info
  const allItems = allCategories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      categoryName: cat.name,
      categoryId: cat.id
    }))
  )

  const cleanQuery = query.toLowerCase().trim()
  const results = cleanQuery === '' 
    ? [] 
    : allItems.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(cleanQuery)
        const descMatch = (item.description || '').toLowerCase().includes(cleanQuery)
        const catMatch = item.categoryName.toLowerCase().includes(cleanQuery)
        return nameMatch || descMatch || catMatch
      })

  const popularSearches = ['Paneer', 'Avocado', 'Truffle', 'Sushi', 'Tiramisu', 'Mocktail', 'Chai', 'Pizza', 'Dim Sum']

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-[#D8C2AA] overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D8C2AA] bg-[#FEEDDE]/80">
          <Search className="w-5 h-5 text-[#BA8A53] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 173 menu items, ingredients..."
            className="w-full bg-transparent text-[#2D1C12] placeholder-[#8A7A6E] text-base sm:text-lg focus:outline-hidden font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#8A7A6E] hover:text-[#2D1C12] hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#EADCCF] text-[#4A3222] font-mono hover:bg-[#DFCDBB]"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips when empty */}
        {cleanQuery === '' && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8A6A4C] mb-3 font-display">
              <Sparkles className="w-3.5 h-3.5 text-[#BA8A53]" />
              <span>Popular Categories & Ingredients</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 text-xs rounded-full bg-[#FEEDDE] hover:bg-[#BA8A53] hover:text-white text-[#4A3222] border border-[#D8C2AA] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        {cleanQuery !== '' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-[#EADCCF]/60">
            {results.length > 0 ? (
              results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item.categoryId, item.id)
                    onClose()
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#F9F0E4] transition-colors flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-[#EBD8C4] text-[#694424] tracking-wider">
                        {item.categoryName}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#2D1C12] group-hover:text-[#8B5024] leading-snug">
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-[#6B5E55] italic leading-normal mt-0.5">
                        ({item.description})
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-1">
                    <span className="font-price font-semibold text-xs sm:text-sm text-[#9E5E28] whitespace-nowrap bg-[#FBF1E6] px-2 py-0.5 rounded-md border border-[#E8D4C0]">
                      {item.price}
                    </span>
                    <span className="text-[10px] text-[#BA8A53] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Jump <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center text-[#8A7A6E]">
                <p className="text-base font-serif">No items found for "{query}"</p>
                <p className="text-xs mt-1">Try checking your spelling or searching for items like pizza, pasta, salad, or chai.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#FEEDDE]/80 border-t border-[#D8C2AA] flex items-center justify-between text-[11px] text-[#7A695D]">
          <span>{results.length > 0 ? `${results.length} item${results.length === 1 ? '' : 's'} found` : `${allItems.length} total items in menu`}</span>
          <span className="flex items-center gap-1 font-medium text-[#8A5F35]">
            <CornerDownLeft className="w-3 h-3" /> Tap to jump to section
          </span>
        </div>
      </div>
    </div>
  )
}
