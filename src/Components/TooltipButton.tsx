import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip: string;
};

export default function TooltipButton({ tooltip, children, ...rest }: Props) {
  return (
    <button {...rest}>
      <span className="Tooltip-text">{tooltip}</span>
      {children}
    </button>
  );
}