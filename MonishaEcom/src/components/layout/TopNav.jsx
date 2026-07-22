import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCart, useGetWishlist } from '@/hooks/EcomHooks';
import { removeToken } from '@/utils/tokenUtils';

function BadgeCount({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="ml-1.5 bg-danger-main text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function TopNav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: cart } = useGetCart();
  const { data: wishlist } = useGetWishlist();

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  const userName = localStorage.getItem('ecom_user_name') || 'User';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const initials = getInitials(userName);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('ecom_user_name');
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="hidden lg:flex items-center h-[72px] px-5 md:px-8 lg:px-12 sticky top-0 z-40 bg-surface-default/90 backdrop-blur-xl border-b border-border-default/50">

      {/* Left: Brand */}
      <div className="flex items-center gap-2 min-w-[220px]">
        <span className="text-2xl font-bold text-text-primary leading-none tracking-tight">MONISHA</span>
        <span className="text-[10px] font-medium text-text-muted tracking-widest uppercase leading-none mt-0.5">Premium Uniforms</span>
      </div>

      {/* Center: Primary Nav Links */}
      <nav className="flex-1 flex items-center justify-center gap-2">
        {PRIMARY_LINKS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-6 py-3 min-w-[110px] justify-center rounded-full text-ui-label font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-subtle text-brand-primary shadow-elevation-1'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted hover:shadow-elevation-1 hover:-translate-y-0.5'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
            {item.label === 'Cart' && <BadgeCount count={cartCount} />}
            {item.label === 'Wishlist' && <BadgeCount count={wishlistCount} />}
          </NavLink>
        ))}
      </nav>

      {/* Right: User Profile Dropdown */}
      <div className="min-w-[220px] flex justify-end">
        <div
          className="relative"
          tabIndex={-1}
          onBlur={(e) => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              setMenuOpen(false);
            }
          }}
        >
          <button
            type="button"
            onFocus={() => setMenuOpen(true)}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 rounded-full transition-all duration-200 hover:bg-surface-muted hover:shadow-elevation-1 active:scale-[0.97]"
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {initials}
            </div>
            <span className="text-sm font-medium text-text-primary hidden xl:block">{userName}</span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-3 w-56 bg-surface-default border border-border-default rounded-panel shadow-elevation-4 overflow-hidden outline-none p-2"
              >
                <div className="px-3 py-3 mb-1">
                  <p className="text-sm font-semibold text-text-primary m-0">{userName}</p>
                </div>

                <div className="space-y-0.5">
                  {DROPDOWN_LINKS.map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleNavigate(item.to);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-input transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-border-default mt-1 pt-1 space-y-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-danger-main hover:bg-danger-bg rounded-input transition-colors"
                  >
                    <LogOut className="w-[18px] h-[18px]" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
