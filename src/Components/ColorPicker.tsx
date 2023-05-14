import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Color, { HexColor, IsHexColor } from '../Palette/Color';
import { colorFromColor } from '../Palette/Palettes'

type Props = {
  color : Color,
  onChange : (c: Color) => void,
};
const hueVariance = 0.10;
const satVariance = 0.20;
const lightVariance = 0.20;

export default function ColorPicker({ color, onChange }: Props) {
    const [hex, setHex] = useState(color.asHex(false));
    const [similarColor1, setSimilarColor1] = useState(color);
    const [similarColor2, setSimilarColor2] = useState(color);
    const [similarColor3, setSimilarColor3] = useState(color);

    const colorStyle1 = useMemo<React.CSSProperties>(() => ({
        backgroundColor: similarColor1.asHex()
    }), [similarColor1]);
    
    const colorStyle2 = useMemo<React.CSSProperties>(() => ({
        backgroundColor: similarColor2.asHex()
    }), [similarColor2]);

    const colorStyle3 = useMemo<React.CSSProperties>(() => ({
        backgroundColor: similarColor3.asHex()
    }), [similarColor3]);

    useEffect(() => {
        setHex(color.asHex(false));
        setSimilarColor1(colorFromColor(color, hueVariance, satVariance, lightVariance));
        setSimilarColor2(colorFromColor(color, hueVariance, satVariance, lightVariance));
        setSimilarColor3(colorFromColor(color, hueVariance, satVariance, lightVariance));
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
                {true ? <span className="Swatch">
                    <div className="SwatchButton" style={colorStyle1} onClick={e=>onChange(similarColor1)}/>
                    <div className="SwatchButton" style={colorStyle2} onClick={e=>onChange(similarColor2)}/>
                    <div className="SwatchButton" style={colorStyle3} onClick={e=>onChange(similarColor3)}/>
                </span> : null}
                <input className="HexInput" pattern='[0-9]+' type='text' maxLength={6} size={6} value={hex} onChange={e => changeHex(e.target.value)} onBlur={onBlur}/>
            </div>
        </div>
    );
}