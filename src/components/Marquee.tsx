const Marquee = () => {
  const items = [
    "NO MORE BORING THEMES",
    "NO CODING NEEDED",
    "READY TO SELL",
    "HIGH CONVERSION",
    "PREMIUM DESIGN",
    "CLEAN EYECATCHING",
  ];

  return (
    <section className="py-8 border-y border-muted overflow-hidden">
      <div className="flex">
        <div className="flex animate-marquee">
          {[...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center shrink-0">
              <span className="font-display text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-tight whitespace-nowrap px-4">
                {item}
              </span>
              <span className="text-primary text-2xl px-4">✦</span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee" aria-hidden="true">
          {[...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center shrink-0">
              <span className="font-display text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-tight whitespace-nowrap px-4">
                {item}
              </span>
              <span className="text-primary text-2xl px-4">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
