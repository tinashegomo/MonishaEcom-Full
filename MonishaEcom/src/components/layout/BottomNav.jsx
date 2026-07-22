import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
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
          className="absolute -top-1 -right-1.5 bg-danger-main text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function BottomNav() {
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

  const getCount = (label) => {
    if (label === 'Cart') return cartCount;
    if (label === 'Wishlist') return wishlistCount;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-default/90 backdrop-blur-xl border-t border-border-default/50 flex items-center justify-around px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] z-50 lg:hidden">

      {PRIMARY_LINKS.map((item) => {
        const count = getCount(item.label);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-[72px] py-2 rounded-xl transition-all duration-200 relative active:scale-90 ${
                isActive
                  ? 'bg-brand-subtle text-brand-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <div className="relative">
              {item.icon}
              <BadgeCount count={count} />
            </div>
            <span className="text-[11px] font-medium leading-tight">{item.label.split(' ')[0]}</span>
          </NavLink>
        );
      })}

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
          className="flex flex-col items-center justify-center gap-1 w-[72px] py-2 rounded-xl transition-all duration-200 text-text-muted hover:text-text-primary active:scale-90"
          aria-label="Profile menu"
          aria-expanded={menuOpen}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-[9px]">
            {initials}
          </div>
          <span className="text-[11px] font-medium leading-tight">More</span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-full right-0 mb-3 w-56 bg-surface-default border border-border-default rounded-panel shadow-elevation-4 overflow-hidden outline-none p-2"
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
    </nav>
  );
}
