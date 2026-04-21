import "./globals.css";

export const metadata = {
  title: "SafeSound | Mute the Noise",
  description: "Premium earplugs designed for concerts, work, travel and sleep. Modern lifestyle protection with style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-primary-50 text-neutral-50">
        {children}
      </body>
    </html>
  );
}
