
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-600 mb-2">
        {label}
      </label>
      <input
        id={inputId}
        className="w-full p-3 text-slate-800 bg-white rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
        {...props}
      />
    </div>
  );
};
