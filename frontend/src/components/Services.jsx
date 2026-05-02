import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Brain, Stethoscope, HeartHandshake, Star } from 'lucide-react'

const services = [
  {
    icon: Brain,
    title: 'Psicología clínica',
    description: 'Terapia individual, de pareja y familiar para tu bienestar emocional.',
    color: 'from-primary/10 to-primary/5',
    iconColor: 'text-primary',
    slug: 'psicologia-clinica',
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2C9 2 7 4 7 7c0 2 1 3.5 2 4.5L7 20h10l-2-8.5c1-1 2-2.5 2-4.5 0-3-2-5-5-5z"/>
        <path d="M9.5 7.5 Q12 9 14.5 7.5"/>
      </svg>
    ),
    title: 'Odontología',
    description: 'Atención dental integral con enfoque en tu salud y estética.',
    color: 'from-gold/10 to-gold/5',
    iconColor: 'text-gold',
    slug: 'odontologia',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="servicios" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-beige/40 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/5 translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block font-sans text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              Nuestros Servicios
            </span>
            <h2 className="section-title gold-underline mb-6">
              ¿En qué podemos ayudarte?
            </h2>
            <p className="font-sans text-forest/65 leading-relaxed text-sm">
              Ofrecemos una atención integral que combina la salud mental y dental en un solo lugar, con profesionales especializados y un enfoque humano.
            </p>
          </motion.div>

          {/* Right: cards grid */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid sm:grid-cols-2 gap-5"
          >
            {services.map((service) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.slug}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${service.color} rounded-2xl p-6 border border-primary/8 group cursor-pointer`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-white shadow-card flex items-center justify-center mb-5 ${service.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-forest mb-2">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-forest/65 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <a
                    href={`#${service.slug}`}
                    className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary group-hover:gap-2.5 transition-all duration-200"
                  >
                    Conocer más <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
