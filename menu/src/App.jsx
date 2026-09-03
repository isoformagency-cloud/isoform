import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { menuData } from './data/menuData'
import Header from './components/Header'
import CategoryNav from './components/CategoryNav'
import MenuSection from './components/MenuSection'
import CategoryDrawer from './components/CategoryDrawer'
import SearchModal from './components/SearchModal'
import FooterDisclaimer from './components/FooterDisclaimer'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const [activeSection, setActiveSection] = useState('all') // 'all' | 'food' | 'beverages'
  const [activeCategory, setActiveCategory] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [highlightedItemId, setHighlightedItemId] = useState(null)
  
  const contentRef = useRef(null)

  // Get filtered categories based on active section
  const foodSection = menuData.sections.find(s => s.id === 'food')
  const bevSection = menuData.sections.find(s => s.id === 'beverages')

  const displayedCategories = React.useMemo(() => {
    if (activeSection === 'food') return foodSection ? foodSection.categories : []
    if (activeSection === 'beverages') return bevSection ? bevSection.categories : []
    // 'all' combines food and beverage categories
    return menuData.sections.flatMap(s => s.categories)
  }, [activeSection, foodSection, bevSection])

  const totalItemsCount = menuData.sections.flatMap(s => s.categories).reduce((acc, cat) => acc + cat.items.length, 0)
  const foodCount = foodSection ? foodSection.categories.reduce((acc, cat) => acc + cat.items.length, 0) : 0
  const bevCount = bevSection ? bevSection.categories.reduce((acc, cat) => acc + cat.items.length, 0) : 0

  // Set initial active category
  useEffect(() => {
    if (displayedCategories.length > 0 && (!activeCategory || !displayedCategories.find(c => c.id === activeCategory))) {
      setActiveCategory(displayedCategories[0].id)
    }
  }, [displayedCategories, activeCategory])

  // GSAP Subtle Entrance on section switch
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
      )
    }
  }, [activeSection])

  // ScrollSpy to track active category as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180

      for (let i = displayedCategories.length - 1; i >= 0; i--) {
        const cat = displayedCategories[i]
        const element = document.getElementById(`cat-${cat.id}`)
        if (element) {
          const top = element.offsetTop
          if (scrollPosition >= top) {
            setActiveCategory(cat.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [displayedCategories])

  // Global Keyboard Shortcut for Search ('/' or Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen])

  // Scroll smoothly to a specific category
  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(`cat-${categoryId}`)
    if (element) {
      const yOffset = -75
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Handle selecting an item from search
  const handleSelectItemFromSearch = (categoryId, itemId) => {
    // If current filter excludes this category, reset filter to 'all'
    const isCategoryVisible = displayedCategories.some(c => c.id === categoryId)
    if (!isCategoryVisible) {
      setActiveSection('all')
    }

    setTimeout(() => {
      handleSelectCategory(categoryId)
      setHighlightedItemId(itemId)
      
      const itemElement = document.getElementById(`item-${itemId}`)
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedItemId(null)
      }, 3000)
    }, 150)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FEEDDE] text-[#342217] selection:bg-[#BA8A53]/25 selection:text-[#2D1C12]">
      {/* Top Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        totalItemsCount={totalItemsCount}
        foodCount={foodCount}
        bevCount={bevCount}
      />

      {/* Sticky Category Navigation */}
      <CategoryNav
        categories={displayedCategories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Menu Feed */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div ref={contentRef} className="space-y-6 sm:space-y-10">
          {displayedCategories.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              highlightedItemId={highlightedItemId}
            />
          ))}
        </div>
      </main>

      {/* Authoritative Disclaimer Footer */}
      <FooterDisclaimer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Category Index Quick-Jump Drawer */}
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sections={menuData.sections}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allCategories={menuData.sections.flatMap(s => s.categories)}
        onSelectItem={handleSelectItemFromSearch}
      />
    </div>
  )
}
