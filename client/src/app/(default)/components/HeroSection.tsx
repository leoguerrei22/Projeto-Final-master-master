
export default function HeroSection({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<div 
    className="flex justify-center items-center h-screen mt-0 relative" 
    style={{ backgroundImage: "url(/images/steak.jpg)", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover" }}
>
    {children}
</div>
  );
}
