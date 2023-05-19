import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false, // Isso vai renderizar o componente apenas no lado do cliente
})

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  )
}
