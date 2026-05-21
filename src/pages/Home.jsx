import HeroEcommerce from "../components/Hero";

const Home = () => {
  return (
    <main>
      <HeroEcommerce />
      
      {/* Placeholder sections for scrolling */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tighter">PRODUCTOS DESTACADOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-zinc-900 rounded-3xl border border-white/5 hover:border-pink-500/50 transition-colors group overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8">
                <div className="text-pink-500 font-mono text-sm mb-2">CATEGORY_0{i}</div>
                <div className="text-2xl font-bold tracking-tight">TECH_ITEM_SPEC_0{i}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="h-screen flex items-center justify-center bg-linear-to-b from-black to-zinc-900">
          <div className="text-center">
            <h2 className="text-5xl md:text-8xl font-black opacity-10 tracking-tighter">NOVA SETUP</h2>
          </div>
      </section>
    </main>
  );
};

export default Home;
