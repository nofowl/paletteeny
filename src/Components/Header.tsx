import React from 'react';
import TooltipButton from './TooltipButton';
import { ReactComponent as ExportIcon } from '../icons/export.svg';
import { ReactComponent as LinkIcon } from '../icons/link.svg';

type Props = {
  onShare: React.MouseEventHandler<HTMLButtonElement>;
  onExportCanvas: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Header({ onShare, onExportCanvas }: Props) {
  return (
    <div className="App-header">
      <TooltipButton className="Export-button Tooltip" tooltip="Share" onClick={onShare}><LinkIcon/></TooltipButton>
      <h1>palet<sup>teeny</sup></h1>
      <TooltipButton className="Export-button Tooltip" tooltip="Export" onClick={onExportCanvas}><ExportIcon/></TooltipButton>
    </div>
  );
};