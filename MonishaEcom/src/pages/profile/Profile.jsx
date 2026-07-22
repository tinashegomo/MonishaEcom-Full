import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, ShoppingBag, Heart, ClipboardList } from 'lucide-react';
import { removeToken } from '@/utils/tokenUtils';

export default function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('ecom_user_name') || 'User';
  const userEmail = localStorage.getItem('ecom_email') || 'No email on file';
  const token = localStorage.getItem('ecom_token');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('ecom_user_name');
    localStorage.removeItem('ecom_email');
    navigate('/login');
  };

  const quickLinks = [
    { label: 'My Orders', icon: <ClipboardList className="w-5 h-5" />, to: '/my-orders' },
    { label: 'Wishlist', icon: <Heart className="w-5 h-5" />, to: '/wishlist' },
    { label: 'Browse Products', icon: <ShoppingBag className="w-5 h-5" />, to: '/products' },
  ];

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <h1 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mb-8 lg:mb-10">Profile</h1>

      {/* Avatar & Name */}
      <div className="flex items-center gap-4 p-6 bg-surface-default border border-border-default rounded-card mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
          {getInitials(userName)}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-text-primary truncate">{userName}</h2>
          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{userEmail}</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-surface-default border border-border-default rounded-card overflow-hidden mb-6">
        {quickLinks.map((link, i) => (
          <button
            key={link.to}
            type="button"
            onClick={() => navigate(link.to)}
            className={`flex items-center gap-3 w-full px-5 py-4 text-left text-sm font-medium text-text-primary hover:bg-surface-elevated transition-colors ${
              i < quickLinks.length - 1 ? 'border-b border-border-default' : ''
            }`}
          >
            <span className="text-text-muted">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </div>

      {/* Account Info */}
      <div className="bg-surface-default border border-border-default rounded-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Account</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Role</span>
            <span className="text-text-primary font-medium">Customer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Auth Status</span>
            <span className="text-success-main font-medium">{token ? 'Authenticated' : 'Not authenticated'}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-danger-bg text-danger-main font-semibold rounded-xl hover:bg-danger-main/15 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
}
