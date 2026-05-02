import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Calendar, Clock, Phone } from 'lucide-react'
import AppointmentForm from '../components/AppointmentForm'

export default function AppointmentPage() {
  const [params] = useSearchParams()
  const specialistId = params.get('specialist')

  return (
    <>
      <Helmet>
        <title>Agenda tu Cita | LumiPlus</title>
        <meta name="description" content="Agenda tu cita en LumiPlus. Atención psicológica y dental en Guatemala." />
      </Helmet>

      <div className="min-h-screen bg-beige pt-20">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-flex items-center gap-2 bg-gold/20 text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-sans font-medium tracking-wider uppercase mb-4">
                <Calendar size={12} />
                Reserva tu espacio
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
                Agenda tu <span className="text-gold italic">cita</span>
              </h1>
              <p className="font-sans text-white/75 max-w-md mx-auto">
                Completa el formulario y nos pondremos en contacto contigo para confirmar tu cita.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Info sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-display text-lg font-semibold text-primary mb-5">
                  Información de la cita
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-sans text-xs font-semibold text-forest/50 uppercase tracking-wider mb-0.5">
                        Horarios
                      </div>
                      <div className="font-sans text-sm text-forest">
                        Lun - Vie: 8:00 - 18:00<br />
                        Sáb: 8:00 - 13:00
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-sans text-xs font-semibold text-forest/50 uppercase tracking-wider mb-0.5">
                        Teléfono
                      </div>
                      <a
                        href="tel:+50247117609"
                        className="font-sans text-sm text-primary font-medium hover:underline"
                      >
                        4711-7609
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary rounded-3xl p-6 text-white">
                <h4 className="font-display text-lg font-semibold mb-3">
                  ¿Prefieres WhatsApp?
                </h4>
                <p className="font-sans text-sm text-white/75 mb-4">
                  Escríbenos directamente y te atendemos de inmediato.
                </p>
                <a
                  href="https://wa.me/50247117609?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl font-sans font-semibold text-sm hover:bg-[#20BC5B] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.940 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escribir por WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white rounded-3xl shadow-card p-8"
            >
              <h2 className="font-display text-2xl font-semibold text-primary mb-6">
                Solicitar cita
              </h2>
              <AppointmentForm specialistId={specialistId} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
