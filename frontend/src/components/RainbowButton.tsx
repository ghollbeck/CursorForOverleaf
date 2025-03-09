import React from 'react';
import { cn } from '../lib/utils';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export function RainbowButton({ children, className, onClick, ...props }: RainbowButtonProps) {
  return (
    <button className={cn('rainbow-button', className)} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
