import React from 'react';
import './Icon.scss';

export type IconName = 'lock' | 'check' | 'star' | 'exp' | 'flag' | 'arrow-right' | 'arrow-down' | 'skull';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
}

const icons: Record<IconName, React.ReactNode> = {
  lock: <span role="img" aria-label="lock">🔒</span>,
  check: <span role="img" aria-label="check">✅</span>,
  star: <span role="img" aria-label="star">⭐</span>,
  exp: <span role="img" aria-label="exp">💎</span>,
  flag: <span role="img" aria-label="flag">🚩</span>,
  'arrow-right': <span role="img" aria-label="arrow">▶</span>,
  'arrow-down': <span role="img" aria-label="arrow">▼</span>,
  skull: <span role="img" aria-label="skull">💀</span>,
};

export const Icon: React.FC<IconProps> = ({ name, size = 'md', className = '', ...props }) => {
  return (
    <span className={`rpg-icon size-${size} ${className}`} {...props}>
      {icons[name]}
    </span>
  );
};
