import { RefObject, useEffect, useRef, useState } from 'react';

export default function useDetectExternalClick(initState : boolean) {
   const triggerRef : RefObject<HTMLDivElement>  = useRef(null); // optional
   const nodeRef : RefObject<HTMLDivElement> = useRef(null); // required 
   
   const [show, setShow] = useState(initState);

    const handleClickOutside = (event : MouseEvent) => {
        //if click is on trigger element, toggle modal
        if(triggerRef.current && 
            triggerRef.current?.contains(event.target as Node)) {
            return setShow(!show);
        }
    
        //if modal is open and click is outside modal, close it
        if(nodeRef.current && 
        !nodeRef.current?.contains(event.target as Node)) {
            return setShow(false);
        }
   };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
        document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return {
        triggerRef,
        nodeRef,
        show,
        setShow
    }
 }