
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-8 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
