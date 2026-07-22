import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck } from 'lucide-react';

const heroText = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const heroLine = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const heroFade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const visualReveal = {
  hidden: { opacity: 0, scale: 1.03 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
};

function StudentIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background circle */}
      <circle cx="200" cy="230" r="160" fill="#E8EDF5" />
      <circle cx="200" cy="230" r="130" fill="#F0F3F9" />

      {/* Girl - left side */}
      <g transform="translate(100, 80)">
        {/* Hair */}
        <ellipse cx="55" cy="52" rx="38" ry="42" fill="#4A3728" />
        <ellipse cx="30" cy="80" rx="14" ry="30" fill="#4A3728" />
        <ellipse cx="80" cy="80" rx="14" ry="30" fill="#4A3728" />

        {/* Face */}
        <ellipse cx="55" cy="58" rx="28" ry="30" fill="#F5D0A9" />

        {/* Hair bangs */}
        <path d="M28 40 Q40 20 55 22 Q70 20 82 40 Q75 30 55 28 Q35 30 28 40Z" fill="#4A3728" />

        {/* Eyes */}
        <ellipse cx="44" cy="56" rx="4" ry="4.5" fill="#2D1B0E" />
        <ellipse cx="66" cy="56" rx="4" ry="4.5" fill="#2D1B0E" />
        <circle cx="45.5" cy="54.5" r="1.5" fill="white" />
        <circle cx="67.5" cy="54.5" r="1.5" fill="white" />

        {/* Eyebrows */}
        <path d="M39 48 Q44 45 49 47" stroke="#4A3728" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M61 47 Q66 45 71 48" stroke="#4A3728" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M53 62 Q55 66 57 62" stroke="#D4A574" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Smile */}
        <path d="M47 70 Q55 77 63 70" stroke="#C47A5A" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="38" cy="66" rx="6" ry="3" fill="#F5B8B0" opacity="0.5" />
        <ellipse cx="72" cy="66" rx="6" ry="3" fill="#F5B8B0" opacity="0.5" />

        {/* Neck */}
        <rect x="48" y="85" width="14" height="14" rx="3" fill="#F5D0A9" />

        {/* Blazer */}
        <path d="M20 100 Q20 95 35 95 L75 95 Q90 95 90 100 L90 200 Q90 210 80 210 L30 210 Q20 210 20 200Z" fill="#1E3A5F" />

        {/* Blazer lapels */}
        <path d="M42 95 L35 130 L50 125Z" fill="#152D4A" />
        <path d="M68 95 L75 130 L60 125Z" fill="#152D4A" />

        {/* White shirt collar */}
        <path d="M44 95 L50 115 L56 95" fill="white" />
        <path d="M54 95 L60 115 L66 95" fill="white" />

        {/* Blazer buttons */}
        <circle cx="55" cy="155" r="3" fill="#2A4F7A" />
        <circle cx="55" cy="175" r="3" fill="#2A4F7A" />

        {/* Tie */}
        <path d="M52 115 L55 145 L58 115Z" fill="#CC2936" />
        <path d="M50 112 Q55 108 60 112 L58 118 L55 115 L52 118Z" fill="#CC2936" />

        {/* Arms */}
        <path d="M20 105 Q5 140 10 180" stroke="#1E3A5F" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M90 105 Q105 140 100 180" stroke="#1E3A5F" strokeWidth="18" strokeLinecap="round" fill="none" />

        {/* Hands */}
        <circle cx="10" cy="182" r="8" fill="#F5D0A9" />
        <circle cx="100" cy="182" r="8" fill="#F5D0A9" />

        {/* Skirt */}
        <path d="M25 205 L15 290 Q55 300 95 290 L85 205Z" fill="#1E3A5F" />
        <path d="M25 205 L45 290" stroke="#152D4A" strokeWidth="1" />
        <path d="M85 205 L65 290" stroke="#152D4A" strokeWidth="1" />

        {/* Legs */}
        <rect x="38" y="285" width="12" height="60" rx="5" fill="#F5D0A9" />
        <rect x="58" y="285" width="12" height="60" rx="5" fill="#F5D0A9" />

        {/* Socks */}
        <rect x="36" y="330" width="16" height="25" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="56" y="330" width="16" height="25" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />

        {/* Shoes */}
        <ellipse cx="44" cy="362" rx="14" ry="7" fill="#2D1B0E" />
        <ellipse cx="66" cy="362" rx="14" ry="7" fill="#2D1B0E" />
      </g>

      {/* Boy - right side */}
      <g transform="translate(200, 90)">
        {/* Hair */}
        <ellipse cx="50" cy="45" rx="32" ry="30" fill="#2D1B0E" />

        {/* Face */}
        <ellipse cx="50" cy="52" rx="26" ry="28" fill="#E8C4A0" />

        {/* Hair top */}
        <path d="M25 35 Q35 18 50 20 Q65 18 75 35 Q68 25 50 23 Q32 25 25 35Z" fill="#2D1B0E" />

        {/* Eyes */}
        <ellipse cx="40" cy="50" rx="4" ry="4.5" fill="#2D1B0E" />
        <ellipse cx="60" cy="50" rx="4" ry="4.5" fill="#2D1B0E" />
        <circle cx="41.5" cy="48.5" r="1.5" fill="white" />
        <circle cx="61.5" cy="48.5" r="1.5" fill="white" />

        {/* Eyebrows */}
        <path d="M35 42 Q40 39 45 41" stroke="#2D1B0E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M55 41 Q60 39 65 42" stroke="#2D1B0E" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M48 56 Q50 60 52 56" stroke="#C99B76" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Smile */}
        <path d="M42 64 Q50 70 58 64" stroke="#B87A5A" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="33" cy="60" rx="5" ry="3" fill="#F5B8B0" opacity="0.4" />
        <ellipse cx="67" cy="60" rx="5" ry="3" fill="#F5B8B0" opacity="0.4" />

        {/* Neck */}
        <rect x="43" y="78" width="14" height="14" rx="3" fill="#E8C4A0" />

        {/* Blazer */}
        <path d="M15 93 Q15 88 30 88 L70 88 Q85 88 85 93 L85 195 Q85 205 75 205 L25 205 Q15 205 15 195Z" fill="#1E3A5F" />

        {/* Blazer lapels */}
        <path d="M38 88 L30 125 L45 120Z" fill="#152D4A" />
        <path d="M62 88 L70 125 L55 120Z" fill="#152D4A" />

        {/* White shirt collar */}
        <path d="M40 88 L45 108 L50 88" fill="white" />
        <path d="M50 88 L55 108 L60 88" fill="white" />

        {/* Blazer buttons */}
        <circle cx="50" cy="148" r="3" fill="#2A4F7A" />
        <circle cx="50" cy="168" r="3" fill="#2A4F7A" />

        {/* Tie */}
        <path d="M47 108 L50 138 L53 108Z" fill="#1E5F3A" />
        <path d="M45 105 Q50 101 55 105 L53 111 L50 108 L47 111Z" fill="#1E5F3A" />

        {/* Arms */}
        <path d="M15 98 Q0 135 5 175" stroke="#1E3A5F" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M85 98 Q100 135 95 175" stroke="#1E3A5F" strokeWidth="18" strokeLinecap="round" fill="none" />

        {/* Hands */}
        <circle cx="5" cy="177" r="8" fill="#E8C4A0" />
        <circle cx="95" cy="177" r="8" fill="#E8C4A0" />

        {/* Trousers */}
        <path d="M25 200 L20 310 L45 310 L50 200Z" fill="#1E3A5F" />
        <path d="M50 200 L55 310 L80 310 L75 200Z" fill="#1E3A5F" />
        <line x1="50" y1="200" x2="50" y2="200" stroke="#152D4A" strokeWidth="1" />

        {/* Shoes */}
        <ellipse cx="32" cy="315" rx="14" ry="7" fill="#2D1B0E" />
        <ellipse cx="68" cy="315" rx="14" ry="7" fill="#2D1B0E" />
      </g>

      {/* Decorative elements */}
      <circle cx="80" cy="120" r="6" fill="#E8A87C" opacity="0.6" />
      <circle cx="340" cy="150" r="4" fill="#85CDCA" opacity="0.6" />
      <circle cx="60" cy="350" r="5" fill="#D4A574" opacity="0.5" />
      <circle cx="360" cy="380" r="3" fill="#E8A87C" opacity="0.5" />
      <path d="M50 160 L55 155 L60 160 L55 165Z" fill="#85CDCA" opacity="0.4" />
      <path d="M350 300 L355 295 L360 300 L355 305Z" fill="#E8A87C" opacity="0.4" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl mb-24 lg:mb-32 bg-gradient-to-br from-[#f8f9fc] to-[#eef1f8]">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1E3A5F 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/[0.04] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl" />

      <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-4 px-6 py-14 sm:px-10 sm:py-18 lg:px-14 lg:py-16 items-center">

        {/* ── Left: Text ── */}
        <motion.div
          variants={heroText}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center"
        >
          <motion.span
            variants={heroLine}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-text-secondary text-xs font-semibold tracking-wide mb-6 w-fit shadow-sm border border-border-light"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            School Uniform Collection
          </motion.span>

          <motion.h1 variants={heroLine} className="mb-4">
            <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-semibold text-text-primary tracking-tight leading-[1.1]">
              Premium School
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-text-primary tracking-tight leading-[0.95] mt-1">
              UNIFORMS
            </span>
            <span className="block text-xl sm:text-2xl lg:text-3xl font-normal text-text-muted tracking-tight leading-tight mt-2">
              – For Every Student.
            </span>
          </motion.h1>

          <motion.p variants={heroFade} className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8 max-w-md">
            Find everything your child needs for the new school term. Premium quality, school approved. Crafted for comfort and style.
          </motion.p>

          <motion.div variants={heroFade} className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2.5 w-56 h-14 px-8 bg-brand-primary text-white font-semibold text-sm rounded-xl hover:bg-brand-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Shop Uniforms
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 w-56 h-14 px-8 text-text-primary font-semibold text-sm rounded-xl border-2 border-border-light hover:border-brand-primary hover:text-brand-primary hover:bg-white/60 transition-all duration-200"
            >
              Browse Schools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={heroFade} className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-text-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium">School Approved</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-medium">4.9 Rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Illustration ── */}
        <motion.div
          variants={visualReveal}
          initial="hidden"
          animate="visible"
          className="relative hidden lg:flex items-center justify-end"
        >
          <div className="relative w-full max-w-[480px]">
            <StudentIllustration />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
