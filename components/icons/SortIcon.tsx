import React from 'react';

interface SortIconProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'ascending' | 'descending';
}

export const SortIcon: React.FC<SortIconProps> = ({ direction, ...props }) => {
  return (
    <div className="inline-flex flex-col items-center justify-center w-4 h-4" {...props}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mb-1.5">
        <path d="M5 15L12 8L19 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              className={direction === 'ascending' ? 'stroke-slate-200' : 'stroke-slate-600'}/>
      </svg>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mt-1.5">
        <path d="M19 9L12 16L5 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={direction === 'descending' ? 'stroke-slate-200' : 'stroke-slate-600'}/>
      </svg>
    </div>
  );
};
