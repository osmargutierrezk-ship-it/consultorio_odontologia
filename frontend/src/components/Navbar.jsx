import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Calendar } from 'lucide-react'

const navLinks = [
  { label: 'Inicio',       href: '/#inicio' },
  { label: 'Nosotros',     href: '/#nosotros' },
  { label: 'Servicios',    href: '/#servicios' },
  { label: 'Especialistas',href: '/#especialistas' },
  { label: 'Blog',         href: '/#blog' },
  { label: 'Contacto',     href: '/#contacto' },
]

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeSection, setActive]  = useState('inicio')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(61,90,69,0.08)]'
          : 'bg-white'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L28 14L20 24L12 14L20 4Z" fill="#C9A84C"/>
                <path d="M20 16L28 26L20 36L12 26L20 16Z" fill="#3D5A45" opacity="0.85"/>
                <path d="M20 4L28 14L20 24L28 34" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.4"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-xl font-semibold text-primary leading-none">LumiPlus</div>
              <div className="font-sans text-[10px] text-primary/60 tracking-widest uppercase leading-none mt-0.5">
                Clínica psicológica y dental
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`relative px-3 py-2 font-sans text-sm font-medium transition-colors duration-200 group
                    ${activeSection === link.label.toLowerCase()
                      ? 'text-primary'
                      : 'text-forest/70 hover:text-primary'
                    }`}
                >
                  {link.label}
                  <span className="absolute left-3 -bottom-0.5 w-0 h-0.5 bg-gold rounded-full transition-all duration-300 group-hover:w-[calc(100%-24px)]" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/agenda" className="btn-primary text-sm">
              <Calendar size={15} />
              Agenda tu cita
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-primary hover:bg-beige transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-primary/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl font-sans text-sm font-medium text-forest/80 hover:bg-beige hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
              <div className="pt-2 pb-1">
                <Link to="/agenda" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center">
                  <Calendar size={15} />
                  Agenda tu cita
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
