// components/Layout.js
"use client"
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Image
        src="/images/steak.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
