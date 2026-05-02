import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, User } from 'lucide-react'

const specialists = [
  {
    id: 1,
    name: 'Lic. Aarón Chávez',
    role: 'Psicólogo Clínico',
    specialty: 'Psicología',
    description: 'Especialista en terapia cognitivo-conductual con enfoque en ansiedad, depresión y relaciones interpersonales.',
    image: '/assets/specialists/aaron.webp',
    badge: 'Psicología',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 2,
    name: 'Dra. Nohemí Argueta',
    role: 'Odontóloga',
    specialty: 'Odontología',
    description: 'Especialista en odontología estética y restaurativa, con enfoque en el bienestar integral del paciente.',
    image: '/assets/specialists/nohemi.webp',
    badge: 'Odontología',
    badgeColor: 'bg-gold/10 text-gold-dark',
  },
]

export default function Specialists() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="especialistas" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-sans text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              Nuestro equipo
            </span>
            <h2 className="section-title gold-underline">
              Conoce a nuestros especialistas
            </h2>
          </motion.div>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map((spec, i) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl shadow-card overflow-hidden border border-primary/5 group"
            >
              {/* Photo */}
              <div className="relative h-64 bg-gradient-to-br from-beige to-beige-dark overflow-hidden">
                <img
                  src={spec.image}
                  alt={spec.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                {/* Fallback avatar */}
                <div
                  className="absolute inset-0 items-center justify-center bg-gradient-to-br from-primary/20 to-beige hidden"
                  aria-hidden="true"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={40} className="text-primary/50" />
                  </div>
                </div>

                {/* Badge */}
                <div className={`absolute top-4 left-4 ${spec.badgeColor} px-3 py-1 rounded-full font-sans text-xs font-semibold`}>
                  {spec.badge}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-forest mb-0.5">
                  {spec.name}
                </h3>
                <p className="font-sans text-sm font-medium text-gold mb-3">
                  {spec.role}
                </p>
                <p className="font-sans text-sm text-forest/60 leading-relaxed mb-5">
                  {spec.description}
                </p>
                <Link
                  to={`/agenda?specialist=${spec.id}`}
                  className="btn-primary w-full justify-center text-sm"
                >
                  <Calendar size={14} />
                  Agendar cita
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
