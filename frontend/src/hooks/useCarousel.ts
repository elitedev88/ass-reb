import { useRef, useState, useEffect, useCallback } from 'react'

interface UseCarouselOptions {
  autoScroll?: boolean
  scrollInterval?: number
  scrollAmount?: number
}

export function useCarousel({
  autoScroll = true,
  scrollInterval = 3000,
  scrollAmount = 300
}: UseCarouselOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoScroll || isPaused) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current
        const maxScroll = container.scrollWidth - container.clientWidth

        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' })
          setCurrentIndex(0)
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
          setCurrentIndex(prev => prev + 1)
        }
      }
    }, scrollInterval)

    return () => clearInterval(interval)
  }, [autoScroll, scrollInterval, isPaused, scrollAmount])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollPos = scrollRef.current.scrollLeft
        const index = Math.round(scrollPos / scrollAmount)
        setCurrentIndex(index)
      }
    }

    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
    return
  }, [scrollAmount])

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const maxScroll = container.scrollWidth - container.clientWidth
      const currentScroll = container.scrollLeft

      if (direction === 'right' && currentScroll >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
        setCurrentIndex(0)
      } else if (direction === 'left' && currentScroll <= 10) {
        container.scrollTo({ left: maxScroll, behavior: 'smooth' })
        setCurrentIndex(Math.floor(maxScroll / scrollAmount))
      } else {
        const targetScroll = direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount

        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        })
      }
    }
  }, [scrollAmount])

  return {
    scrollRef,
    isPaused,
    currentIndex,
    setIsPaused,
    scroll
  }
}