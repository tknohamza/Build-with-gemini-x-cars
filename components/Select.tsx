import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full px-3 py-2.5 appearance-none
            bg-white border rounded-lg shadow-sm 
            text-slate-900 
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Select;