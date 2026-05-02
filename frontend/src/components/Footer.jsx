import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-forest text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L28 14L20 24L12 14L20 4Z" fill="#C9A84C"/>
                <path d="M20 16L28 26L20 36L12 26L20 16Z" fill="white" opacity="0.85"/>
              </svg>
              <div>
                <div className="font-display text-xl font-semibold leading-none">LumiPlus</div>
                <div className="font-sans text-[10px] text-white/50 tracking-widest uppercase mt-0.5">
                  Clínica psicológica y dental
                </div>
              </div>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed mb-5">
              Tu bienestar es nuestra prioridad. Acompañamiento profesional y humano para tu salud mental y dental.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/ClinicaLumiPlus"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/lumiplus_gt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-white/50 mb-5">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {['Inicio', 'Nosotros', 'Servicios', 'Especialistas', 'Blog', 'Contacto'].map((item) => (
                <li key={item}>
                  <a
                    href={`/#${item.toLowerCase()}`}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-white/50 mb-5">
              Servicios
            </h4>
            <ul className="space-y-2.5">
              {['Psicología clínica', 'Odontología'].map((s) => (
                <li key={s}>
                  <a href="#servicios" className="font-sans text-sm text-white/70 hover:text-gold transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-white/50 mb-5">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/70">
                <MapPin size={15} className="text-gold flex-shrink-0 mt-0.5" />
                6ta calle 63-01, Pinares del Norte, zona 18, Guatemala
              </li>
              <li>
                <a href="tel:+50247117609" className="flex gap-3 text-sm text-white/70 hover:text-gold transition-colors">
                  <Phone size={15} className="text-gold flex-shrink-0 mt-0.5" />
                  4711-7609
                </a>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Clock size={15} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  Lun - Vie: 8:00 - 18:00<br />
                  Sáb: 8:00 - 13:00
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-white/40">
            © {year} LumiPlus. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-white/40 flex items-center gap-1">
            Hecho con <Heart size={11} className="text-gold" /> en Guatemala
          </p>
        </div>
      </div>
    </footer>
  )
}
