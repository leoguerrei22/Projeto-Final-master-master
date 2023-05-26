import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex justify-center items-center h-screen mt-0 relative">
      {" "}
      {/* mt-16 adiciona uma margem ao topo */}
      <Image
        src="/images/steak.jpg"
        alt="hero image"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
      />
    </div>
  );
}
