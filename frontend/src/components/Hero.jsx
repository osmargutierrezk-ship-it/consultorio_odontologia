import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/assets/carrusel/img1.webp',
    fallbackBg: 'from-primary/80 to-forest/90',
  },
  {
    id: 2,
    image: '/assets/carrusel/img2.webp',
    fallbackBg: 'from-forest/80 to-primary-700/90',
  },
  {
    id: 3,
    image: '/assets/carrusel/img3.webp',
    fallbackBg: 'from-primary-600/80 to-forest/90',
  },
]

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const [[current, direction], setSlide] = useState([0, 0])
  const [imgErrors, setImgErrors] = useState({})

  const go = useCallback((newIdx, dir) => {
    setSlide([newIdx, dir])
  }, [])

  const next = useCallback(() => {
    go((current + 1) % slides.length, 1)
  }, [current, go])

  const prev = useCallback(() => {
    go((current - 1 + slides.length) % slides.length, -1)
  }, [current, go])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
      {/* Carousel Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {imgErrors[current] ? (
              /* Fallback gradient when image not found */
              <div className={`absolute inset-0 bg-gradient-to-br ${slides[current].fallbackBg}`} />
            ) : (
              <img
                src={slides[current].image}
                alt={`Slide ${current + 1}`}
                className="w-full h-full object-cover"
                loading={current === 0 ? 'eager' : 'lazy'}
                onError={() => setImgErrors(prev => ({ ...prev, [current]: true }))}
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-forest/75 via-forest/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative diagonal element */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gold z-10" />
      <div className="absolute left-0 top-0 w-0 h-0 z-10"
        style={{
          borderLeft: '120px solid rgba(201,168,76,0.15)',
          borderBottom: '120vh solid transparent',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-32">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-sans font-medium tracking-wider uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Clínica Psicológica y Dental
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] mb-6"
          >
            <span className="text-gold italic">Tu bienestar</span>
            <br />
            es nuestra prioridad
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-sans text-white/85 text-lg leading-relaxed mb-10"
          >
            Acompañamiento profesional y humano para tu salud mental y dental.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/agenda" className="btn-primary text-sm md:text-base px-7 py-3.5">
              <Calendar size={17} />
              Agenda tu cita
            </Link>
            <a href="#especialistas" className="btn-outline border-white/60 text-white hover:bg-white hover:text-primary text-sm md:text-base px-7 py-3.5">
              <Users size={17} />
              Conoce a nuestros especialistas
            </a>
          </motion.div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all flex items-center justify-center"
          aria-label="Anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-6 h-2 bg-gold'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all flex items-center justify-center"
          aria-label="Siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 right-0 z-10 hidden md:flex"
      >
        <div className="bg-white/10 backdrop-blur-md border-t border-l border-white/20 rounded-tl-2xl px-8 py-5 flex gap-8">
          {[
            { num: '10+', label: 'Años de experiencia' },
            { num: '500+', label: 'Pacientes atendidos' },
            { num: '2',   label: 'Especialidades' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-semibold text-gold">{stat.num}</div>
              <div className="font-sans text-xs text-white/70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
