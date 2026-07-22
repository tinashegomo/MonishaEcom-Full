import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="animate-fade-in min-h-[calc(100vh-72px)] flex flex-col items-center justify-center py-12 px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="text-center mb-12">
        <h1 className="text-[44px] font-extrabold tracking-[-0.04em] leading-[1.05] mb-4">
          <span className="bg-gradient-to-r from-brand-primary via-rose-500 to-amber-500 bg-clip-text text-transparent">Welcome Back</span>
        </h1>
        <p className="text-[18px] text-text-secondary leading-[1.7] max-w-sm mx-auto">
          Sign in to continue
        </p>
      </div>

      <div className="w-full max-w-xl overflow-hidden">
        <div className="px-8 sm:px-12 py-12">
          <LoginForm />

          <p className="text-[15px] text-text-secondary mt-10 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-primary hover:text-brand-hover transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
