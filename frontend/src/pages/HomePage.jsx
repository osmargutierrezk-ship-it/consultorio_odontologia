import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import Specialists from '../components/Specialists'
import ContactPanel from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>LumiPlus | Clínica Psicológica y Dental en Guatemala</title>
        <meta
          name="description"
          content="LumiPlus - Clínica psicológica y dental en Pinares del Norte, zona 18, Guatemala. Psicología clínica, odontología y terapias especializadas."
        />
      </Helmet>
      <Hero />
      <Services />
      <About />
      <Specialists />
      <ContactPanel />
    </>
  )
}
