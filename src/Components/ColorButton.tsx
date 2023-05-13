import React,  {useMemo} from 'react';
import Color from '../Palette/Color';
import { BlockPicker } from 'react-color';
import useDetectExternalClick from '../useDetectExternalClick';

type Props = {
  className? : String,
  color : Color;
};

export default function Header({ className, color }: Props) {

  const { show, nodeRef, triggerRef } = useDetectExternalClick(false);

  const colorStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: '#'+color.asHex()
  }), [color]);

  const pickerStyle = useMemo<React.CSSProperties>(() => ({
    visibility: show ? "visible" : "hidden",
    opacity: show ? "1" : "0",
  }), [show]);

  return (
    <div ref={triggerRef} className={"ColorButton " + className} style={colorStyle}>
      <div ref={nodeRef} style={pickerStyle}>
        <BlockPicker color={"#"+color.asHex()}/>
      </div>
    </div>
  );
};