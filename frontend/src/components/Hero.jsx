import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Users } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, A11y]}
          className="h-full"
          loop
          speed={900}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          a11y={{ enabled: true }}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-screen min-h-screen">
                <img
                  src={slide.image}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling
                    if (fallback) fallback.classList.remove('hidden')
                  }}
                />
                <div className={`hidden absolute inset-0 bg-gradient-to-br ${slide.fallbackBg}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-forest/75 via-forest/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gold z-10" />

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
    </section>
  )
}
