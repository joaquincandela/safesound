"use client";

export default function Home() {
  const phone = "51968255972";
  const whatsapp = `https://wa.me/${phone}`;

  return (
    <main className="bg-primary-50 text-neutral-50 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 gradient-radial opacity-50 pointer-events-none" />
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-primary-100 bg-primary-50/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">
              SAFE<span className="text-minimal-beige">SOUND</span>
            </h1>
            <p className="text-xs text-neutral-100 tracking-widest uppercase">MUTE THE NOISE</p>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center relative">
        <div className="z-10">
          <p className="text-minimal-sand uppercase tracking-[0.3em] text-sm font-medium">
            Protección auditiva premium
          </p>

          <h2 className="text-6xl md:text-7xl font-black mt-6 leading-[0.95]">
            Silencia el ruido.
            <br />
            <span className="text-minimal-beige">Vive mejor.</span>
          </h2>

          <p className="mt-6 text-neutral-100 text-xl max-w-xl leading-relaxed">
            Earplugs diseñados para conciertos, trabajo, estudio, viajes y descanso. 
            Protección moderna con estilo premium para tu lifestyle.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_#25D366]"
            >
              Comprar Ahora
            </a>

            <a
              href="#beneficios"
              className="border border-minimal-sand text-minimal-sand px-8 py-4 rounded-full hover:bg-minimal-sand hover:text-primary-50 transition-all duration-300"
            >
              Ver Más
            </a>
          </div>
        </div>

        {/* PRODUCT VISUAL */}
        <div className="relative z-10">
          <div className="relative overflow-hidden rounded-[3rem]">
            <img 
              src="/images/earplugsafesound.png" 
              alt="Background" 
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Small logo in top-right corner with dynamic effects */}
            <div className="absolute top-4 right-4">
              <div className="relative animate-float">
                <div className="w-12 h-6 rounded-full border-2 border-minimal-beige flex items-center justify-end px-2 shadow-lg shadow-minimal-beige/30">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-minimal-beige to-minimal-sand shadow-xl shadow-minimal-beige/50" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-minimal-brown animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-minimal-sand animate-pulse delay-75" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        id="beneficios"
        className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8"
      >
        {[
          {
            title: "Conciertos & Fiestas",
            description: "Disfruta la música sin dañar tus oídos. Reduce el decibelio sin perder la experiencia.",
            icon: "🎵"
          },
          {
            title: "Trabajo & Estudio",
            description: "Más enfoque y cero distracciones. Perfecto para ambientes ruidosos y concentración.",
            icon: "🎯"
          },
          {
            title: "Sueño & Viajes",
            description: "Descanso profundo donde sea. Ideal para dormir y viajar en paz total.",
            icon: "✈️"
          }
        ].map((item, i) => (
          <div
            key={i}
            className="bg-primary-100 p-8 rounded-3xl border border-primary-100 hover:border-minimal-sand/50 transition-all duration-300 group"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-bold text-minimal-beige mb-4">{item.title}</h3>
            <p className="text-neutral-100 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </section>

      {/* WHY SAFESOUND */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-[3rem] bg-primary-100 border border-primary-100 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-minimal-brown/5 to-minimal-sand/5" />
          <div className="relative z-10">
            <h3 className="text-5xl font-black mb-6">
              ¿Por qué <span className="text-minimal-beige">SafeSound</span>?
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h4 className="text-2xl font-bold text-minimal-sand mb-4">No es médico, es lifestyle</h4>
                <p className="text-neutral-100 text-lg leading-relaxed">
                  Somos una solución moderna para el ruido diario. Pensado para personas activas que valoran 
                  diseño, comodidad y protección en su día a día.
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-minimal-brown mb-4">Diseño que te representa</h4>
                <p className="text-neutral-100 text-lg leading-relaxed">
                  Estilo minimalista, tecnología avanzada y comodidad premium. Porque tu protección 
                  auditiva debe ser tan cool como tú.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-black text-center mb-16">
          Lo que dicen <span className="text-minimal-beige">nuestros clientes</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Carlos M.",
              rating: 5,
              text: "Los mejores earplugs que he usado. Perfectos para conciertos, sigo la música pero sin el daño en los oídos.",
              role: "Músico"
            },
            {
              name: "Ana L.",
              rating: 5,
              text: "Trabajo en coworking y estos son salvavidas. Me concentro como nunca y el diseño es increíble.",
              role: "Designer"
            },
            {
              name: "Diego R.",
              rating: 5,
              text: "Viajo mucho y duermo como un bebé. Compré varios para regalar, todos encantados.",
              role: "Digital Nomad"
            }
          ].map((review, i) => (
            <div key={i} className="bg-primary-100 p-8 rounded-3xl border border-primary-100">
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j} className="text-minimal-beige text-xl">★</span>
                ))}
              </div>
              <p className="text-neutral-100 mb-6 italic">"{review.text}"</p>
              <div>
                <p className="font-bold text-neutral-50">{review.name}</p>
                <p className="text-minimal-sand text-sm">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-[3rem] p-16 bg-gradient-to-r from-minimal-beige via-minimal-brown to-minimal-sand text-primary-50 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h3 className="text-5xl font-black mb-6">Protege tus oídos hoy</h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Compra directa por WhatsApp. Atención rápida y personalizada. 
              Envíos a todo el país.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#25D366] px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
            >
              Comprar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-12 text-neutral-100 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-6">
          <h4 className="text-2xl font-black mb-4">
            SAFE<span className="text-minimal-beige">SOUND</span>
          </h4>
          <p className="text-sm mb-4">© 2026 SafeSound • Mute the Noise</p>
          <p className="text-xs text-neutral-100">
            Next.js 15 • TailwindCSS • Premium Lifestyle Protection
          </p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl hover:scale-110 transition-all duration-300 animate-glow z-50"
      >
        W
      </a>
    </main>
  );
}
