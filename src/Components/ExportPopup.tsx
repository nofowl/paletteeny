import { useEffect, useState } from "react";

interface Props {
    show: boolean;
    imageSrc: string;
    onClose: () => void;
}

const ExportPopup = (props: Props) => {

    const [show, setShown] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        setShown(props.show);
        setImageSrc(props.imageSrc);
    }, [props]);

    return (
        <div style={{
            visibility: show ? "visible" : "hidden",
            opacity: show ? "1" : "0"
        }}
        className="ExportOverlay"
        onClick={props.onClose}>
            <img src={imageSrc} className="Export"/>
        </div>
    )
}

export default ExportPopup;