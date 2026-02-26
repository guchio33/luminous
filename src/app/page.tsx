import Link from "next/link";

function Star({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`absolute text-gold opacity-60 animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      ✦
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-navy overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="top-[10%] left-[5%] text-xs" delay={0} />
        <Star className="top-[15%] right-[10%] text-sm" delay={0.5} />
        <Star className="top-[25%] left-[20%] text-lg" delay={1} />
        <Star className="top-[8%] left-[45%] text-xs" delay={1.5} />
        <Star className="top-[35%] right-[25%] text-sm" delay={2} />
        <Star className="top-[45%] left-[8%] text-xs" delay={0.3} />
        <Star className="top-[55%] right-[5%] text-lg" delay={1.2} />
        <Star className="top-[65%] left-[15%] text-sm" delay={0.8} />
        <Star className="top-[75%] right-[20%] text-xs" delay={1.8} />
        <Star className="top-[85%] left-[30%] text-sm" delay={0.6} />
        <Star className="top-[20%] right-[40%] text-xs" delay={2.2} />
        <Star className="top-[70%] right-[45%] text-lg" delay={1.4} />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo / App name */}
        <div className="animate-float">
          <span className="text-gold text-4xl mb-4 block">✦</span>
        </div>

        <h1 className="font-[var(--font-cormorant-garamond)] text-5xl md:text-7xl font-semibold text-white tracking-wide mb-4">
          Luminous
        </h1>

        <p className="font-[var(--font-noto-serif-jp)] text-gold-light text-lg md:text-xl mb-8 tracking-wider">
          夢を言葉にすると、世界が変わる
        </p>

        <p className="font-[var(--font-noto-serif-jp)] text-white/70 text-sm md:text-base max-w-md mb-12 leading-relaxed">
          暗闘の中で光り輝く夢とやりたいことを共有する場所。
          <br />
          あなたの夢は、誰かの暗闘を照らす星になる。
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/timeline"
            className="px-8 py-3 bg-gold text-navy font-medium rounded-full hover:bg-gold-light transition-colors duration-300"
          >
            夢を見つける
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-gold/50 text-gold rounded-full hover:bg-gold/10 transition-colors duration-300"
          >
            ログイン
          </Link>
        </div>

        {/* Tagline */}
        <p className="font-[var(--font-cormorant-garamond)] text-white/40 text-sm mt-16 italic">
          Your dreams are stars in someone else&apos;s darkness
        </p>
      </main>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-light to-transparent pointer-events-none" />
    </div>
  );
}
