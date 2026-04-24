import React from 'react';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ children, definition }) => {
  return (
    <span className="relative group cursor-help border-b border-dotted border-gray-400" title={definition}>
      {children}
    </span>
  );
};

export default GlossaryTooltip;
