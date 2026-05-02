import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AppointmentPage from './pages/AppointmentPage'

export default function App() {
  return (
    <>
      <Helmet>
        <title>LumiPlus | Clínica Psicológica y Dental</title>
      </Helmet>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agenda" element={<AppointmentPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
