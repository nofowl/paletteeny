import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Color, { HexColor, IsHexColor } from '../Palette/Color';

type Props = {
  color : Color,
  onChange : (c: Color) => void,
};

export default function ColorPicker({ color, onChange }: Props) {
    const [hex, setHex] = useState(color.asHex(false));

    const colorStyle = useMemo<React.CSSProperties>(() => ({
        backgroundColor: color.asHex()
    }), [color]);

    useEffect(() => {
        setHex(color.asHex(false));
    },[color]);

    const changeHex = useCallback((c: string) => {
        setHex(c);
        if (IsHexColor(c))
        {
            onChange(HexColor(c));
        }
    }, [setHex, onChange]);

    const onBlur = useCallback(() => {
        if (!IsHexColor(hex)) setHex(color.asHex(false));
    }, [hex, setHex, color]);

    return (
        <div className="ColorPicker"> 
            <div className="Bubble">
                {false ? <span className="Swatch">
                    <div className="SwatchButton" style={colorStyle}/>
                    <div className="SwatchButton" style={colorStyle}/>
                    <div className="SwatchButton" style={colorStyle}/>
                </span> : null}
                <input className="HexInput" pattern='[0-9]+' type='text' maxLength={6} size={6} value={hex} onChange={e => changeHex(e.target.value)} onBlur={onBlur}/>
            </div>
        </div>
    );
}