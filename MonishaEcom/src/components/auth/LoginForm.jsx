import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLoginCustomer } from '@/hooks/EcomHooks';
import { saveToken } from '@/utils/tokenUtils';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLoginCustomer();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          saveToken(data.token);
          localStorage.setItem('ecom_email', data.email || '');
          if (data.customerName) {
            localStorage.setItem('ecom_user_name', data.customerName);
          } else if (data.email) {
            localStorage.setItem('ecom_user_name', data.email.split('@')[0]);
          }
          navigate('/');
        },
        onError: (err) => {
          const msg = err.response?.data?.message || err.message || 'Login failed';
          setError(msg);
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-[13px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" autoComplete="email"
            className="w-full px-4 py-3.5 bg-surface-muted/50 border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all duration-200" />
        </div>

        <div>
          <label htmlFor="password" className="block text-[13px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"
              className="w-full px-4 py-3.5 pr-11 bg-surface-muted/50 border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all duration-200" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <motion.button
            type="submit"
            disabled={loginMutation.isPending}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {loginMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
