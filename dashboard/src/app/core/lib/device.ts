export const isMobile: boolean = typeof window !== 'undefined' &&
    (typeof navigator !== 'undefined' &&
    (navigator as any).maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches));