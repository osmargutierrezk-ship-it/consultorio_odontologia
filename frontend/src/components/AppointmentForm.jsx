import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Calendar, User, Phone, Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'

const schema = z.object({
  name:    z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  phone:   z.string().min(8, 'Teléfono inválido'),
  email:   z.string().email('Email inválido').optional().or(z.literal('')),
  date:    z.string().min(1, 'Selecciona una fecha'),
  service: z.string().min(1, 'Selecciona un servicio'),
  message: z.string().optional(),
})

const services = [
  'Psicología clínica',
  'Odontología',
]

export default function AppointmentForm({ specialistId }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, specialistId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al agendar')
      setSubmitted(true)
      toast.success('¡Cita agendada exitosamente!')
      reset()
    } catch (err) {
      toast.error(err.message || 'Error al agendar la cita')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-primary mb-3">
          ¡Cita agendada!
        </h3>
        <p className="font-sans text-sm text-forest/65 mb-6 max-w-xs">
          Nos pondremos en contacto contigo pronto para confirmar tu cita.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-outline text-sm"
        >
          Agendar otra cita
        </button>
      </motion.div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block font-sans text-xs font-semibold text-forest/60 uppercase tracking-wider mb-1.5">
          Nombre completo *
        </label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
          <input
            {...register('name')}
            placeholder="Tu nombre"
            className={`input-field pl-10 ${errors.name ? 'border-red-400 bg-red-50/50' : ''}`}
          />
        </div>
        {errors.name && <p className="font-sans text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Phone & email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs font-semibold text-forest/60 uppercase tracking-wider mb-1.5">
            Teléfono *
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              {...register('phone')}
              placeholder="4711-7609"
              className={`input-field pl-10 ${errors.phone ? 'border-red-400 bg-red-50/50' : ''}`}
            />
          </div>
          {errors.phone && <p className="font-sans text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block font-sans text-xs font-semibold text-forest/60 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              {...register('email')}
              type="email"
              placeholder="correo@ejemplo.com"
              className={`input-field pl-10 ${errors.email ? 'border-red-400 bg-red-50/50' : ''}`}
            />
          </div>
          {errors.email && <p className="font-sans text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Date & Service */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs font-semibold text-forest/60 uppercase tracking-wider mb-1.5">
            Fecha preferida *
          </label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              {...register('date')}
              type="date"
              min={today}
              className={`input-field pl-10 ${errors.date ? 'border-red-400 bg-red-50/50' : ''}`}
            />
          </div>
          {errors.date && <p className="font-sans text-xs text-red-500 mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block font-sans text-xs font-semibold text-forest/60 uppercase tracking-wider mb-1.5">
            Servicio *
          </label>
          <select
            {...register('service')}
            className={`input-field ${errors.service ? 'border-red-400 bg-red-50/50' : ''}`}
          >
            <option value="">Seleccionar...</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.service && <p className="font-sans text-xs text-red-500 mt-1">{errors.service.message}</p>}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block font-sans text-xs font-semibold text-forest/60 uppercase tracking-wider mb-1.5">
          Mensaje (opcional)
        </label>
        <div className="relative">
          <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-forest/40" />
          <textarea
            {...register('message')}
            rows={3}
            placeholder="Cuéntanos un poco sobre tu consulta..."
            className="input-field pl-10 resize-none"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full justify-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Agendando...
          </>
        ) : (
          <>
            <Calendar size={16} />
            Confirmar cita
          </>
        )}
      </motion.button>

      <p className="font-sans text-xs text-center text-forest/40">
        También puedes contactarnos por{' '}
        <a
          href="https://wa.me/50247117609"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline"
        >
          WhatsApp
        </a>
      </p>
    </form>
  )
}
