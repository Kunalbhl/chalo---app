import React from 'react';
import { GLASS_CLASSES } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${GLASS_CLASSES} rounded-2xl p-4 transition-all duration-300 hover:shadow-xl ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
