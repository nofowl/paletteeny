import React, { useMemo } from "react";

interface Props {
  show: boolean;
  imageSrc: string;
  onClose: () => void;
}

export default function ExportPopup({show, imageSrc, onClose}: Props) {
  const style = useMemo<React.CSSProperties>(() => ({
    visibility: show ? "visible" : "hidden",
    opacity: show ? "1" : "0",
  }), [show]);

  return (
    <div
      style={style}
      className="ExportOverlay"
      onClick={onClose}
    >
      <img src={imageSrc} alt="Palette to export" className="Export"/>
    </div>
  );
}