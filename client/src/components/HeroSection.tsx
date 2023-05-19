import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="flex justify-center items-center h-screen mt-5 relative"> {/* mt-16 adiciona uma margem ao topo */}
      <Image 
        src="https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?cs=srgb&dl=pexels-malidate-van-769289.jpg&fm=jpg" 
        alt="hero image"
        layout='fill'
        objectFit="cover"
        className="absolute z-0"
      />
    </div>
  )
}
