/**
 * productIllustrations — the per-garment-type line-art SVGs and color dots.
 * Extracted out of ProductCard.jsx so ProductDetails (or any future
 * component needing the same illustration) doesn't have to duplicate it.
 */

export function getProductIllustration(type, color) {
  const c = color?.toLowerCase() || '';
  let stroke = '#374151';
  if (c.includes('navy') || c.includes('blue')) stroke = '#1e40af';
  else if (c.includes('red')) stroke = '#dc2626';
  else if (c.includes('green')) stroke = '#16a34a';
  else if (c.includes('grey') || c.includes('gray')) stroke = '#6b7280';
  else if (c.includes('black')) stroke = '#1f2937';
  else if (c.includes('white')) stroke = '#9ca3af';
  else if (c.includes('purple') || c.includes('violet')) stroke = '#7c3aed';
  else if (c.includes('pink')) stroke = '#db2777';
  else if (c.includes('brown') || c.includes('maroon')) stroke = '#92400e';

  const t = (type || '').toLowerCase();

  if (t.includes('shirt') || t.includes('blouse') || t.includes('top')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M40 20 L35 25 L20 45 L30 50 L35 35 L35 120 L85 120 L85 35 L90 50 L100 45 L85 25 L80 20" />
        <path d="M40 20 L55 28 L80 20" />
        <line x1="60" y1="28" x2="60" y2="55" />
        <circle cx="60" cy="65" r="1.5" fill={stroke} />
        <circle cx="60" cy="78" r="1.5" fill={stroke} />
        <circle cx="60" cy="91" r="1.5" fill={stroke} />
        <path d="M42 20 L42 14 L78 14 L78 20" />
      </svg>
    );
  }
  if (t.includes('blazer') || t.includes('jacket') || t.includes('coat')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M38 18 L30 28 L15 55 L28 58 L35 38 L35 125 L85 125 L85 38 L92 58 L105 55 L90 28 L82 18" />
        <path d="M38 18 L55 28 L82 18" />
        <path d="M55 28 L55 125" />
        <path d="M45 55 L55 75 L65 55" />
        <circle cx="48" cy="85" r="1.5" fill={stroke} />
        <circle cx="48" cy="100" r="1.5" fill={stroke} />
      </svg>
    );
  }
  if (t.includes('tie') || t.includes('bow')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M50 15 L70 15 L65 35 L60 45 L55 35 Z" />
        <path d="M55 45 L45 70 L55 120 L60 130 L65 120 L75 70 L65 45" />
        <line x1="53" y1="55" x2="67" y2="55" />
        <line x1="51" y1="65" x2="69" y2="65" />
      </svg>
    );
  }
  if (t.includes('trouser') || t.includes('pant') || t.includes('short')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M30 20 L30 25 L35 30 L40 25 L60 35 L80 25 L85 30 L90 25 L90 20" />
        <path d="M30 25 L35 125 L55 125 L60 70 L65 125 L85 125 L90 25" />
        <line x1="30" y1="45" x2="90" y2="45" />
      </svg>
    );
  }
  if (t.includes('skirt') || t.includes('dress')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M42 15 L78 15 L80 20 L75 30 L45 30 L40 20 Z" />
        <path d="M45 30 L30 125 L90 125 L75 30" />
        <line x1="60" y1="30" x2="60" y2="55" />
        <path d="M38 65 L82 65" />
        <path d="M34 90 L86 90" />
      </svg>
    );
  }
  if (t.includes('shoe') || t.includes('sneaker')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M25 95 L25 70 L35 55 L50 50 L55 60 L75 60 L90 65 L95 80 L95 95 L25 95" />
        <path d="M55 60 L55 95" />
        <path d="M75 60 L78 95" />
        <ellipse cx="60" cy="95" rx="35" ry="4" />
      </svg>
    );
  }
  if (t.includes('jersey') || t.includes('t-shirt') || t.includes('tshirt')) {
    return (
      <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M40 18 L35 22 L15 40 L25 48 L35 35 L35 120 L85 120 L85 35 L95 48 L105 40 L85 22 L80 18" />
        <path d="M40 18 L55 26 L80 18" />
        <path d="M50 18 L50 30 L70 30 L70 18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 140" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M40 20 L35 25 L20 45 L30 50 L35 35 L35 120 L85 120 L85 35 L90 50 L100 45 L85 25 L80 20" />
      <path d="M40 20 L55 28 L80 20" />
      <line x1="60" y1="28" x2="60" y2="55" />
      <circle cx="60" cy="65" r="1.5" fill={stroke} />
      <circle cx="60" cy="78" r="1.5" fill={stroke} />
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
