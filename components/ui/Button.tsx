
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'solid', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

  const variantClasses = {
    solid: 'bg-teal-600 text-white hover:bg-teal-700',
    secondary: 'bg-teal-100 text-teal-800 hover:bg-teal-200',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
