import { useEffect } from 'react'

export const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll-linked reveal: progress follows scroll position, so it reverses on the way up.
export function useReveal(ref) {
  useEffect(() => {
    const el = ref.current
    if (still()) return
    let raf = 0
    const draw = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = innerHeight
      const t = Math.min(Math.max((vh - r.top) / (vh * 0.6), 0), 1)
      const p = 1 - (1 - t) ** 3
      el.style.transform = `translate3d(0, ${60 * (1 - p)}px, 0) scale(${0.9 + 0.1 * p})`
      el.style.opacity = 0.4 + 0.6 * p
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    draw()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [ref])
}

// Light sections arrive as a rounded sheet that grows to full bleed, and leave the same way.
// Progress is tied to scroll position, so it can be stopped or reversed at any point.
export function useSheet(ref, on = true) {
  useEffect(() => {
    const el = ref.current
    if (!on || !el || still()) return
    let raf = 0
    const draw = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = innerHeight
      const span = vh * 0.9
      // the last section can't scroll all the way up, so finish entering by the page end
      const lowestTop = r.top + scrollY - (document.documentElement.scrollHeight - vh)
      const enter = (vh - r.top) / Math.min(span, vh - Math.max(lowestTop, 0))
      const exit = r.bottom / span
      const t = Math.min(Math.max(Math.min(enter, exit), 0), 1)
      const p = t * t * (3 - 2 * t)
      el.style.setProperty('--s', (0.92 + 0.08 * p).toFixed(4))
      el.style.setProperty('--r', `${(44 * (1 - p)).toFixed(1)}px`)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    draw()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [ref, on])
}

// Section copy fades up once.
export function useFade(ref) {
  useEffect(() => {
    const el = ref.current
    if (still()) return el.classList.add('in')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}
