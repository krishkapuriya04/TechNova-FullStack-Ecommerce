export function ProductCarousel({ children, className = '' }) {
  return (
    <div
      className={`flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pb-2 scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  )
}

export function ProductCarouselItem({ children, className = '' }) {
  return (
    <div className={`w-[min(100%,22rem)] shrink-0 snap-start sm:w-[22rem] ${className}`}>{children}</div>
  )
}
