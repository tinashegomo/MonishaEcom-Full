import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, ShoppingBag } from 'lucide-react';
import { useAddToWishlist, useRemoveFromWishlist, useAddToCart, useGetWishlist } from '@/hooks/EcomHooks';
import { getStoredToken } from '@/utils/tokenUtils';
import { isDepleted, getAvailableSizes, getLowStock } from '@/utils/productHelpers';

/**
 * High-quality product mockups — detailed vector illustrations with
 * fabric shading, depth, and realistic proportions.
 * Each type gets a distinct, recognizable silhouette that reads as
 * "clothing" not "icon".
 */

export function getProductMockup(type, color) {
  const c = color?.toLowerCase() || '';
  // Base fabric tones per color
  let fabric = '#e5e7eb';
  let fabricDark = '#d1d5db';
  let fabricLight = '#f3f4f6';
  let stitch = '#9ca3af';
  
  if (c.includes('navy') || c.includes('blue')) {
    fabric = '#1e3a5f'; fabricDark = '#172a45'; fabricLight = '#2d4a6b'; stitch = '#3b82f6';
  } else if (c.includes('red') || c.includes('maroon')) {
    fabric = '#7f1d1d'; fabricDark = '#450a0a'; fabricLight = '#991b1b'; stitch = '#dc2626';
  } else if (c.includes('green')) {
    fabric = '#14532d'; fabricDark = '#052e16'; fabricLight = '#166534'; stitch = '#16a34a';
  } else if (c.includes('black') || c.includes('grey') || c.includes('gray')) {
    fabric = '#374151'; fabricDark = '#1f2937'; fabricLight = '#4b5563'; stitch = '#6b7280';
  } else if (c.includes('white') || c.includes('cream')) {
    fabric = '#f9fafb'; fabricDark = '#e5e7eb'; fabricLight = '#ffffff'; stitch = '#d1d5db';
  } else if (c.includes('purple') || c.includes('violet')) {
    fabric = '#581c87'; fabricDark = '#3b0764'; fabricLight = '#6b21a8'; stitch = '#a855f7';
  } else if (c.includes('pink')) {
    fabric = '#9d174d'; fabricDark = '#701739'; fabricLight = '#be185d'; stitch = '#ec4899';
  } else if (c.includes('brown')) {
    fabric = '#78350f'; fabricDark = '#451a03'; fabricLight = '#92400e'; stitch = '#d97706';
  }

  const t = (type || '').toLowerCase();

  // ── Shirt / Blouse / Top ─────────────────────────────────────
  if (t.includes('shirt') || t.includes('blouse') || t.includes('top')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="shirtBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <linearGradient id="shirtSleeve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="fabricShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>
        
        <g filter="url(#fabricShadow)">
          {/* Main body */}
          <path
            d="M55 35 L48 42 L35 75 L45 80 L48 70 L48 200 L152 200 L152 70 L155 80 L165 75 L152 42 L145 35 Z"
            fill="url(#shirtBody)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Left sleeve */}
          <path
            d="M48 42 L25 45 L22 75 L48 70 Z"
            fill="url(#shirtSleeve)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Right sleeve */}
          <path
            d="M152 42 L175 45 L178 75 M152 70 Z"
            fill="url(#shirtSleeve)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Collar */}
          <path
            d="M75 35 L100 22 L125 35 L110 35 L100 42 L90 35 Z"
            fill={fabric}
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Placket */}
          <rect x="98" y="35" width="4" height="165" fill={fabricDark} opacity="0.15" rx="2"/>
          {/* Buttons */}
          {[55, 80, 105, 130, 155].map((y, i) => (
            <circle key={i} cx="100" cy={y} r="3" fill={fabricDark} opacity="0.4"/>
          ))}
          {/* Pocket */}
          <path
            d="M115 95 L140 95 L140 120 L115 120 Z"
            fill={fabricDark}
            opacity="0.2"
            stroke={fabricDark}
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
          {/* Stitching details */}
          <path d="M55 35 L48 42" stroke={stitch} strokeWidth="0.5" opacity="0.5"/>
          <path d="M145 35 L152 42" stroke={stitch} strokeWidth="0.5" opacity="0.5"/>
        </g>
      </svg>
    );
  }

  // ── Blazer / Jacket ──────────────────────────────────────────
  if (t.includes('blazer') || t.includes('jacket') || t.includes('coat')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="blazerBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="blazerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        <g filter="url(#blazerShadow)">
          {/* Main body - structured with lapels */}
          <path
            d="M50 38 L42 45 L32 75 L42 80 L42 205 L158 205 L158 80 L168 75 L158 45 L150 38 Z"
            fill="url(#blazerBody)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Left lapel */}
          <path
            d="M50 38 L42 45 L70 95 L90 65 L90 38 Z"
            fill="url(#blazerBody)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Right lapel */}
          <path
            d="M150 38 L158 45 L130 95 L110 65 L110 38 Z"
            fill="url(#blazerBody)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Sleeves */}
          <path d="M32 75 L20 78 L18 160 L42 155 Z" fill="url(#blazerBody)" stroke={fabricDark} strokeWidth="0.5"/>
          <path d="M168 75 L180 78 L182 160 L158 155 Z" fill="url(#blazerBody)" stroke={fabricDark} strokeWidth="0.5"/>
          {/* Cuff buttons */}
          <circle cx="28" cy="168" r="2.5" fill={fabricDark} opacity="0.4"/>
          <circle cx="34" cy="168" r="2.5" fill={fabricDark} opacity="0.4"/>
          <circle cx="170" cy="168" r="2.5" fill={fabricDark} opacity="0.4"/>
          <circle cx="176" cy="168" r="2.5" fill={fabricDark} opacity="0.4"/>
          {/* Front buttons */}
          <circle cx="100" cy="100" r="3.5" fill={fabricDark} opacity="0.5"/>
          <circle cx="100" cy="125" r="3.5" fill={fabricDark} opacity="0.5"/>
          {/* Pocket flaps */}
          <rect x="75" y="90" width="35" height="18" rx="2" fill={fabricDark} opacity="0.15"/>
          <rect x="125" y="90" width="35" height="18" rx="2" fill={fabricDark} opacity="0.15"/>
          {/* Breast pocket */}
          <path d="M120 65 L150 65 L150 80 L120 80 Z" fill={fabricDark} opacity="0.15" stroke={fabricDark} strokeWidth="0.5" strokeDasharray="3 2"/>
        </g>
      </svg>
    );
  }

  // ── Tie ──────────────────────────────────────────────────────
  if (t.includes('tie') || t.includes('bow')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="tieGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="tieShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>
        <g filter="url(#tieShadow)">
          {/* Knot */}
          <ellipse cx="100" cy="55" rx="22" ry="16" fill="url(#tieGrad)" stroke={fabricDark} strokeWidth="0.5"/>
          <path d="M88 55 Q100 45 112 55" stroke={fabricDark} strokeWidth="0.5" fill="none" opacity="0.3"/>
          {/* Blade */}
          <path
            d="M78 71 L55 195 L145 195 L122 71 Z"
            fill="url(#tieGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Dimple */}
          <path d="M90 85 Q100 75 110 85" stroke={fabricDark} strokeWidth="0.5" fill="none" opacity="0.2"/>
          {/* Keeper loop */}
          <rect x="85" y="175" width="30" height="8" rx="4" fill={fabricDark} opacity="0.2"/>
        </g>
      </svg>
    );
  }

  // ── Trousers / Pants / Shorts ────────────────────────────────
  if (t.includes('trouser') || t.includes('pant') || t.includes('short')) {
    const isShort = t.includes('short');
    const hemY = isShort ? 140 : 220;
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="pantGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fabricDark} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="pantShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>
        <g filter="url(#pantShadow)">
          {/* Waistband */}
          <rect x="45" y="30" width="110" height="28" rx="4" fill={fabricDark} />
          {/* Belt loops */}
          {[55, 75, 95, 115, 135].map((x, i) => (
            <rect key={i} x={x} y="32" width="4" height="24" rx="2" fill={fabric} />
          ))}
          {/* Main legs */}
          <path
            d="M45 58 L42 70 L42 220 L78 220 L78 70 Z"
            fill="url(#pantGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          <path
            d="M155 58 L158 70 L158 220 L122 220 L122 70 Z"
            fill="url(#pantGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Creases */}
          <path d="M55 58 L55 220" stroke={fabricDark} strokeWidth="0.3" opacity="0.2" strokeDasharray="8 4"/>
          <path d="M145 58 L145 220" stroke={fabricDark} strokeWidth="0.3" opacity="0.2" strokeDasharray="8 4"/>
          {/* Pockets */}
          <ellipse cx="55" cy="80" rx="18" ry="10" fill={fabricDark} opacity="0.15"/>
          <ellipse cx="145" cy="80" rx="18" ry="10" fill={fabricDark} opacity="0.15"/>
          {/* Back pocket */}
          <rect x="110" y="70" width="25" height="20" rx="2" fill={fabricDark} opacity="0.15"/>
          {/* Cuffs */}
          <rect x="38" y={hemY - 8} width="24" height="16" rx="2" fill={fabricDark} opacity="0.3"/>
          <rect x="138" y={hemY - 8} width="24" height="16" rx="2" fill={fabricDark} opacity="0.3"/>
        </g>
      </svg>
    );
  }

  // ── Skirt / Dress ────────────────────────────────────────────
  if (t.includes('skirt') || t.includes('dress')) {
    const isDress = t.includes('dress');
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="skirtGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fabricDark} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="skirtShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>
        <g filter="url(#skirtShadow)">
          {/* Waistband */}
          <rect x="40" y="30" width="120" height="22" rx="3" fill={fabricDark} />
          {/* Pleats */}
          {[...Array(8)].map((_, i) => {
            const x = 50 + i * 12.5;
            return (
              <path
                key={i}
                d={`M${x} 52 L${x - 2} 75 Q${x + 5} 100 ${x + 2} 180 L${x + 14} 180 Q${x + 7} 100 ${x + 16} 75 Z`}
                fill="url(#skirtGrad)"
                stroke={fabricDark}
                strokeWidth="0.3"
                opacity="0.9"
              />
            );
          })}
          {/* Hem */}
          <path
            d="M45 180 Q60 188 75 180 Q90 188 105 180 Q120 188 135 180 Q150 188 155 180"
            fill="none"
            stroke={fabricDark}
            strokeWidth="1.5"
            opacity="0.3"
          />
          {isDress && (
            <>
              {/* Bodice */}
              <path
                d="M55 30 L55 10 L145 10 L145 30 L135 52 L65 52 Z"
                fill="url(#skirtGrad)"
                stroke={fabricDark}
                strokeWidth="0.5"
              />
              {/* Straps */}
              <rect x="70" y="10" width="12" height="20" rx="2" fill={fabricDark} />
              <rect x="118" y="10" width="12" height="20" rx="2" fill={fabricDark} />
            </>
          )}
        </g>
      </svg>
    );
  }

  // ── Shoes ────────────────────────────────────────────────────
  if (t.includes('shoe') || t.includes('sneaker')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="shoeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <linearGradient id="soleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#e5e5e5" />
          </linearGradient>
          <filter id="shoeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#000" floodOpacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#shoeShadow)" transform="translate(25, 40)">
          {/* Sole */}
          <path
            d="M20 140 Q30 130 40 140 L130 140 Q140 130 150 140 L150 155 L20 155 Z"
            fill="url(#soleGrad)"
            stroke="#d4d4d4"
            strokeWidth="1"
          />
          {/* Midsole */}
          <path d="M25 140 L145 140" stroke="#fff" strokeWidth="2" opacity="0.3"/>
          {/* Upper */}
          <path
            d="M50 140 L35 80 Q30 60 50 55 L95 55 Q115 60 110 80 L95 140 Z"
            fill="url(#shoeGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Vamp */}
          <path d="M50 100 L90 100 Q95 85 90 70 L60 70 Q55 85 50 100" fill={fabric} opacity="0.5"/>
          {/* Laces */}
          {[85, 95, 105, 115].map((y, i) => (
            <ellipse key={i} cx="75" cy={y} rx="15" ry="4" fill="#fff" opacity="0.9" stroke="#ddd" strokeWidth="0.5"/>
          ))}
          {/* Toe cap */}
          <path d="M35 80 Q50 70 65 80 L65 95 Q50 85 35 95 Z" fill={fabricDark} opacity="0.3"/>
          {/* Heel counter */}
          <path d="M110 80 Q115 70 110 55 L95 55 Q90 70 95 80 Z" fill={fabricDark} opacity="0.2"/>
        </g>
      </svg>
    );
  }

  // ── Socks ────────────────────────────────────────────────────
  if (t.includes('sock')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="sockGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fabricDark} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="sockShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="#000" floodOpacity="0.1"/>
          </filter>
        </defs>
        <g filter="url(#sockShadow)">
          <path
            d="M65 30 L65 200 Q75 210 90 200 L90 30 Q75 20 65 30"
            fill="url(#sockGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Rib cuff */}
          <rect x="65" y="30" width="25" height="30" fill={fabricDark} opacity="0.4"/>
          {/* Heel */}
          <ellipse cx="77" cy="165" rx="8" ry="12" fill={fabricDark} opacity="0.2"/>
          {/* Toe */}
          <ellipse cx="77" cy="55" rx="8" ry="6" fill={fabricDark} opacity="0.15"/>
        </g>
      </svg>
    );
  }

  // ── Cap / Hat ────────────────────────────────────────────────
  if (t.includes('cap') || t.includes('hat')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="capShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        <g filter="url(#capShadow)">
          {/* Crown */}
          <path
            d="M50 100 Q50 60 100 40 Q150 60 150 100"
            fill="url(#capGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Panels */}
          <path d="M100 40 L100 100" stroke={fabricDark} strokeWidth="0.3" opacity="0.2" strokeDasharray="4 3"/>
          <path d="M65 85 Q100 60 135 85" stroke={fabricDark} strokeWidth="0.3" opacity="0.2" fill="none"/>
          {/* Button on top */}
          <circle cx="100" cy="40" r="8" fill={fabricDark} />
          {/* Brim */}
          <ellipse cx="100" cy="100" rx="65" ry="18" fill={fabricDark} />
          <ellipse cx="100" cy="100" rx="55" ry="14" fill="url(#capGrad)" />
          {/* Stitching on brim */}
          <ellipse cx="100" cy="100" rx="55" ry="14" fill="none" stroke={fabricDark} strokeWidth="0.3" opacity="0.15" strokeDasharray="8 4"/>
          {/* Sweatband */}
          <path d="M50 100 Q50 60 100 40 Q150 60 150 100" fill="none" stroke={fabricDark} strokeWidth="2" opacity="0.1"/>
        </g>
      </svg>
    );
  }

  // ── T-Shirt / Jersey ────────────────────────────────────────
  if (t.includes('jersey') || t.includes('t-shirt') || t.includes('tshirt')) {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="teeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricLight} />
            <stop offset="50%" stopColor={fabric} />
            <stop offset="100%" stopColor={fabricDark} />
          </linearGradient>
          <filter id="teeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>
        <g filter="url(#teeShadow)">
          {/* Body */}
          <path
            d="M45 35 L38 42 L28 70 L40 75 L40 205 L160 205 L160 75 L162 70 L172 42 L165 35 Z"
            fill="url(#teeGrad)"
            stroke={fabricDark}
            strokeWidth="0.5"
          />
          {/* Sleeves */}
          <path d="M38 42 L20 45 L18 85 L40 75 Z" fill="url(#teeGrad)" stroke={fabricDark} strokeWidth="0.5"/>
          <path d="M162 42 L180 45 L182 85 L160 75 Z" fill="url(#teeGrad)" stroke={fabricDark} strokeWidth="0.5"/>
          {/* Neck rib */}
          <path d="M70 35 L100 20 L130 35 L120 35 L100 38 L80 35 Z" fill={fabricDark} />
          {/* Sleeve hems */}
          <rect x="18" y="80" width="22" height="6" rx="1" fill={fabricDark} opacity="0.3"/>
          <rect x="160" y="80" width="22" height="6" rx="1" fill={fabricDark} opacity="0.3"/>
          {/* Bottom hem */}
          <rect x="38" y="199" width="124" height="6" rx="1" fill={fabricDark} opacity="0.3"/>
        </g>
      </svg>
    );
  }

  // ── Default fallback ────────────────────────────────────────
  return (
    <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="defGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fabricLight} />
          <stop offset="50%" stopColor={fabric} />
          <stop offset="100%" stopColor={fabricDark} />
        </linearGradient>
        <filter id="defShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.15"/>
        </filter>
      </defs>
      <rect x="50" y="50" width="100" height="140" rx="12" fill="url(#defGrad)" filter="url(#defShadow)"/>
      <text x="100" y="120" textAnchor="middle" fill={fabricDark} fontSize="14" opacity="0.4">Uniform</text>
    </svg>
  );
}

export function getColorDot(color) {
  if (!color) return null;
  const c = color.toLowerCase();
  const map = {
    black: '#1f2937', white: '#f3f4f6', navy: '#1e3a5f', blue: '#2563eb',
    red: '#dc2626', green: '#16a34a', grey: '#6b7280', gray: '#6b7280',
    yellow: '#eab308', gold: '#d97706', pink: '#ec4899', purple: '#7c3aed',
    violet: '#7c3aed', brown: '#92400e', maroon: '#7f1d1d', cream: '#fef3c7',
  };
  for (const [key, val] of Object.entries(map)) {
    if (c.includes(key)) return val;
  }
  return '#9ca3af';
}

export default function ProductCard({ product, index = 0 }) {
  const [justAdded, setJustAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const { data: wishlist = [] } = useGetWishlist();
  const isAuthenticated = !!getStoredToken();

  const isInWishlist = useMemo(() => {
    return wishlist.some((item) => String(item.imsProductId) === String(product.productId));
  }, [wishlist, product.productId]);

  const wishlistItem = useMemo(() => {
    return wishlist.find((item) => String(item.imsProductId) === String(product.productId));
  }, [wishlist, product.productId]);

  const depleted = isDepleted(product);
  const availableSizes = getAvailableSizes(product);
  const lowStock = getLowStock(product);
  const colorDot = getColorDot(product.color);
  const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000;

  const subtitle = [product.schoolName, product.type, product.variant].filter(Boolean).join(' · ');

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isInWishlist && wishlistItem) {
      removeFromWishlist.mutate(wishlistItem.wishlistId);
    } else {
      addToWishlist.mutate({ imsProductId: product.productId });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (depleted || availableSizes.length === 0 || addToCart.isPending) return;
    const size = availableSizes[0];
    addToCart.mutate(
      { imsProductId: product.productId, imsProductSizeId: size.productSizeId, size: size.size, quantity: 1 },
      { onSuccess: () => { setJustAdded(true); setTimeout(() => setJustAdded(false), 1200); } }
    );
  };

  return (
    <Link to={`/products/${product.productId}`} className="block group/card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="flex flex-col"
        style={{ gap: '16px' }}
      >
        {/* ── Image Container — 283×326 aspect ratio ── */}
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ aspectRatio: '283 / 326' }}
        >
          {/* Background */}
          <div
            className={`absolute inset-0 ${
              (product.color?.toLowerCase()?.includes('white') || product.color?.toLowerCase()?.includes('cream'))
                ? 'bg-neutral-200'
                : 'bg-neutral-100'
            }`}
          />

          {/* Ambient color glow on hover */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${colorDot || '#e60000'}12 0%, transparent 70%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
          />

          {/* Product mockup */}
          <div
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="w-full h-full max-w-[220px]"
              style={{ filter: isHovered ? 'drop-shadow(0 16px 32px rgba(0,0,0,0.18))' : 'drop-shadow(0 8px 24px rgba(0,0,0,0.1))', transition: 'filter 0.4s ease' }}
            >
              {getProductMockup(product.type, product.color)}
            </div>
          </div>

          {/* Badge — top left */}
          {isNew && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-semibold">
              Hot Item
            </span>
          )}
          {depleted && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-neutral-800 text-white text-[11px] font-semibold">
              Sold Out
            </span>
          )}
          {!depleted && lowStock && !isNew && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-amber-500 text-white text-[11px] font-semibold">
              Low Stock
            </span>
          )}

          {/* Wishlist — top right, grows on hover */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full bg-white shadow-elevation-1 border border-border-default transition-all duration-300"
            style={{
              width: isHovered ? '44px' : '36px',
              height: isHovered ? '44px' : '36px',
              opacity: isHovered ? 1 : 0.7,
              color: isInWishlist ? '#e60000' : undefined,
              boxShadow: isHovered ? (isInWishlist ? '0 8px 24px rgba(230, 0, 0, 0.25)' : '0 8px 24px rgba(230, 0, 0, 0.15)') : undefined,
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
          >
            <Heart
              className={isInWishlist ? 'text-danger-main' : 'text-danger-main'}
              style={{ width: isHovered ? '20px' : '16px', height: isHovered ? '20px' : '16px' }}
              strokeWidth={isInWishlist ? 0 : 1.5}
              fill={isInWishlist ? 'currentColor' : 'none'}
            />
          </button>

          {/* Mobile wishlist — always visible on touch */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="sm:hidden absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-elevation-1 border border-border-default"
          >
            <Heart
              className={isInWishlist ? 'text-danger-main' : 'text-danger-main'}
              strokeWidth={isInWishlist ? 0 : 1.5}
              fill={isInWishlist ? 'currentColor' : 'none'}
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>

        {/* ── Details — text area below image ── */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          {/* Title */}
          <h3 className="text-base font-bold text-text-primary line-clamp-1 group-hover/card:text-brand-primary transition-colors duration-200 leading-snug">
            {product.productName}
          </h3>

          {/* Price */}
          <span className="text-lg font-extrabold text-brand-primary tracking-tight">
            ${product.productPrice?.toFixed(2)}
          </span>

          {/* Subtitle — type · variant · school */}
          {subtitle && (
            <p className="text-sm text-text-secondary truncate">
              {subtitle}
            </p>
          )}

          {/* Color */}
          {product.color && (
            <p className="text-sm text-text-muted">
              Color: <span className="font-medium text-text-secondary">{product.color}</span>
            </p>
          )}

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <p className="text-sm text-text-muted">
              Available Sizes: <span className="font-medium text-text-secondary">{availableSizes.map((s) => s.size).join(', ')}</span>
            </p>
          )}
        </div>

        {/* ── Add to Cart button — brand primary ── */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={depleted || availableSizes.length === 0 || addToCart.isPending}
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-primary"
          style={{ boxShadow: '0 4px 14px -3px rgba(230, 0, 0, 0.35)' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
                <Check className="w-4 h-4" strokeWidth={2.5} /> Added
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> {depleted ? 'Sold Out' : 'Add to cart'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </Link>
  );
}