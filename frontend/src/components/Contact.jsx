import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '50247117609'
const WHATSAPP_MSG = encodeURIComponent('Hola, me gustaría agendar una cita en LumiPlus.')

export default function ContactPanel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const contactItems = [
    {
      icon: MapPin,
      label: 'Dirección',
      value: '6ta calle 63-01, Pinares del Norte, zona 18, Guatemala',
      href: 'https://maps.google.com/?q=6ta+calle+63-01+Pinares+del+Norte+zona+18+Guatemala',
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: '4711-7609',
      href: 'tel:+50247117609',
    },
    {
      icon: Clock,
      label: 'Horarios',
      value: 'Lun - Vie: 8:00 - 18:00\nSáb: 8:00 - 13:00',
      href: null,
    },
  ]

  return (
    <section id="contacto" className="py-20 md:py-28 bg-beige relative overflow-hidden">
      {/* Background noise texture */}
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-sans text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            Encuéntranos
          </span>
          <h2 className="section-title">Visítanos</h2>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
          {/* Contact info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl shadow-card p-8 space-y-6"
          >
            <h3 className="font-display text-2xl font-semibold text-primary">
              Información de contacto
            </h3>

            <div className="space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon
                const inner = (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-sans text-xs font-semibold uppercase tracking-wider text-forest/50 mb-0.5">
                        {item.label}
                      </div>
                      <div className="font-sans text-sm text-forest leading-relaxed whitespace-pre-line">
                        {item.value}
                      </div>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={item.label}>{inner}</div>
                )
              })}
            </div>

            {/* WhatsApp button */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-2xl font-sans font-semibold text-sm hover:bg-[#20BC5B] transition-colors shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
            >
              <MessageCircle size={19} />
              Escríbenos por WhatsApp
            </a>

            {/* Social links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com/ClinicaLumiPlus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary/15 rounded-xl font-sans text-xs font-medium text-forest/70 hover:border-primary hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href="https://instagram.com/lumiplus_gt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary/15 rounded-xl font-sans text-xs font-medium text-forest/70 hover:border-primary hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </motion.div>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl overflow-hidden shadow-card h-[420px] lg:h-full min-h-[380px] relative"
          >
            <iframe
              title="LumiPlus location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.234!2d-90.4803!3d14.6349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM4JzA1LjYiTiA5MMKwMjgnNDkuMSJX!5e0!3m2!1ses!2sgt!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Map overlay badge */}
            <div className="absolute top-4 left-4 bg-white rounded-xl shadow-card px-4 py-2.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" />
              <span className="font-sans text-xs font-semibold text-forest">LumiPlus Clínica</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
