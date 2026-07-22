import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

function UniformIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="500" rx="24" fill="#F0F3F9" />
      <circle cx="200" cy="220" r="140" fill="#E4E9F4" />
      <g transform="translate(115, 60)">
        <path d="M85 0 Q85 -5 90 -5 L95 -5 Q100 -5 100 0" stroke="#888" strokeWidth="2.5" fill="none" />
        <path d="M5 40 L85 0 L165 40" stroke="#999" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="85" cy="0" r="4" fill="#999" />
        <path d="M20 45 Q20 38 40 38 L130 38 Q150 38 150 45 L150 260 Q150 270 140 270 L30 270 Q20 270 20 260Z" fill="#1E3A5F" />
        <path d="M65 38 L50 100 L75 90Z" fill="#152D4A" />
        <path d="M105 38 L120 100 L95 90Z" fill="#152D4A" />
        <path d="M68 38 L75 80 L82 38" fill="white" />
        <path d="M88 38 L95 80 L102 38" fill="white" />
        <path d="M80 80 L85 160 L90 80Z" fill="#CC2936" />
        <path d="M77 75 Q85 68 93 75 L90 83 L85 80 L80 83Z" fill="#CC2936" />
        <rect x="100" y="140" width="30" height="3" rx="1.5" fill="#152D4A" />
        <circle cx="85" cy="170" r="3.5" fill="#2A4F7A" />
        <circle cx="85" cy="200" r="3.5" fill="#2A4F7A" />
        <path d="M20 48 L5 180" stroke="#1E3A5F" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d="M150 48 L165 180" stroke="#1E3A5F" strokeWidth="28" strokeLinecap="round" fill="none" />
      </g>
      <g transform="translate(135, 340)">
        <path d="M0 0 L-15 80 Q65 90 145 80 L130 0Z" fill="#1E3A5F" />
        <line x1="0" y1="0" x2="25" y2="80" stroke="#152D4A" strokeWidth="0.8" />
        <line x1="65" y1="0" x2="65" y2="82" stroke="#152D4A" strokeWidth="0.8" />
        <line x1="130" y1="0" x2="105" y2="80" stroke="#152D4A" strokeWidth="0.8" />
      </g>
      <circle cx="60" cy="100" r="5" fill="#85CDCA" opacity="0.4" />
      <circle cx="350" cy="140" r="4" fill="#E8A87C" opacity="0.4" />
      <circle cx="50" cy="400" r="3" fill="#D4A574" opacity="0.3" />
      <circle cx="360" cy="420" r="5" fill="#85CDCA" opacity="0.3" />
      <path d="M340 80 L345 75 L350 80 L345 85Z" fill="#E8A87C" opacity="0.3" />
      <path d="M60 460 L65 455 L70 460 L65 465Z" fill="#85CDCA" opacity="0.3" />
    </svg>
  );
}

export default function Register() {
  return (
    <div className="animate-fade-in min-h-[calc(100vh-72px)] flex items-center justify-center py-12 lg:py-16 px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-7xl overflow-hidden">
        <div className="lg:grid lg:grid-cols-2 lg:min-h-[680px]">
          {/* Left: Illustration + Branding */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f9fc] to-[#eef1f8] rounded-l-3xl p-12">
            <h2 className="text-2xl font-bold text-text-primary mb-3">Monisha Uniforms</h2>
            <p className="text-center text-text-secondary text-sm max-w-xs mb-10 leading-relaxed">
              Premium school uniforms crafted for comfort and durability.
            </p>
            <div className="w-full max-w-[380px]">
              <UniformIllustration />
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex flex-col justify-center px-10 lg:px-14 py-14">
            <div className="mb-10">
              <h1 className="text-[42px] font-extrabold text-text-primary tracking-[-0.03em] leading-[1.05] mb-4">
                Create your account
              </h1>
              <p className="text-[18px] text-text-secondary leading-[1.7] max-w-sm">
                Join thousands of parents who trust Monisha for premium school uniforms.
              </p>
            </div>

            <RegisterForm />

            <p className="text-[15px] text-text-secondary mt-10 text-center">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-primary hover:text-brand-hover transition-colors">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
