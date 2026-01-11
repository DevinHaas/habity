import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_background.jpeg"
          alt="Medieval landscape"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
