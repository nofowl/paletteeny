import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip: string;
};

export default function TooltipButton({ tooltip, children, ...rest }: Props) {
  return (
    <button {...rest}>
      <span className="Bubble">{tooltip}</span>
      {children}
    </button>
  );
}