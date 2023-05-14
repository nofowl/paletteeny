import React from 'react';
import TooltipButton from './TooltipButton';
import { ReactComponent as ExportIcon } from '../icons/Export.svg';
import { ReactComponent as LinkIcon } from '../icons/Link.svg';

type Props = {
  onShare: React.MouseEventHandler<HTMLButtonElement>;
  onExportCanvas: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Header({ onShare, onExportCanvas }: Props) {
  return (
    <div className="App-header">
      <TooltipButton className="TooltipButton ExportButton Tooltip" tooltip="Share" onClick={onShare}><LinkIcon/></TooltipButton>
      <h1 className='disable-text-selection'>palet<sup>teeny</sup></h1>
      <TooltipButton className="TooltipButton ExportButton Tooltip" tooltip="Export" onClick={onExportCanvas}><ExportIcon/></TooltipButton>
    </div>
  );
};