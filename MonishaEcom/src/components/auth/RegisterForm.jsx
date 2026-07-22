import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRegisterCustomer } from '@/hooks/EcomHooks';
import { saveToken } from '@/utils/tokenUtils';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegisterCustomer();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !phone || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const name = `${firstName} ${lastName}`.trim();

    registerMutation.mutate(
      { name, phone, email, password },
      {
        onSuccess: (data) => {
          saveToken(data.token);
          localStorage.setItem('ecom_email', data.email || email);
          localStorage.setItem('ecom_user_name', data.customerName || name);
          navigate('/');
        },
        onError: (err) => {
          const msg = err.response?.data?.message || err.message || 'Registration failed';
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-[13px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">First Name</label>
            <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name" autoComplete="given-name"
              className="w-full px-4 py-3.5 bg-surface-muted/50 border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all duration-200" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-[13px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">Last Name</label>
            <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name" autoComplete="family-name"
              className="w-full px-4 py-3.5 bg-surface-muted/50 border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all duration-200" />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-[13px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">Phone Number</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="+263 77 123 4567" autoComplete="tel"
            className="w-full px-4 py-3.5 bg-surface-muted/50 border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all duration-200" />
        </div>

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
              onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password"
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
            disabled={registerMutation.isPending}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {registerMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
