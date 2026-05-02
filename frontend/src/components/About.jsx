import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Heart, Award, Users } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Calidez humana',
    description: 'Cada paciente es tratado con respeto, empatía y atención personalizada.',
  },
  {
    icon: Shield,
    title: 'Confidencialidad',
    description: 'Tu privacidad y bienestar son nuestra máxima prioridad en cada sesión.',
  },
  {
    icon: Award,
    title: 'Profesionalismo',
    description: 'Equipo altamente capacitado con actualización continua.',
  },
  {
    icon: Users,
    title: 'Enfoque integral',
    description: 'Atendemos la salud mental y dental en un solo lugar.',
  },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="nosotros" className="py-20 md:py-28 bg-beige relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block font-sans text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              Sobre nosotros
            </span>
            <h2 className="section-title gold-underline mb-6">
              Somos LumiPlus
            </h2>
            <p className="font-sans text-base text-forest/70 leading-relaxed mb-5">
              Somos una clínica psicológica y dental en Guatemala, comprometida con el bienestar integral de cada persona que nos visita. Nuestro nombre refleja nuestra misión: <span className="text-primary font-medium">iluminar el camino hacia una vida más plena y saludable</span>.
            </p>
            <p className="font-sans text-sm text-forest/60 leading-relaxed mb-8">
              Combinamos la atención en salud mental y dental bajo un mismo techo, con especialistas comprometidos con tu bienestar.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {values.map((val, i) => {
                const Icon = val.icon
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-sans text-sm font-semibold text-forest mb-0.5">
                        {val.title}
                      </div>
                      <div className="font-sans text-xs text-forest/60 leading-relaxed">
                        {val.description}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main image card */}
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-primary to-primary-700 shadow-card-hover">
              <img
                src="/assets/clinic/interior.webp"
                alt="Clínica LumiPlus"
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
                loading="lazy"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card-hover p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                <Award size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-primary">500+</div>
                <div className="font-sans text-xs text-forest/60">Pacientes satisfechos</div>
              </div>
            </motion.div>

            {/* Decorative dots */}
            <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #3D5A45 1.5px, transparent 1.5px)',
                backgroundSize: '8px 8px',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
