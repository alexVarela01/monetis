//make dialog
import React from 'react'
import './Dialog.css'
import { IoMdClose } from "react-icons/io";

interface DialogProps {
  title: string;
  children: React.ReactNode  
  isOpen: boolean
  onClose: () => void
}

const Dialog = ({ title, children, isOpen, onClose }: DialogProps) => {
  React.useEffect(() => {
    const closeDialog = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', closeDialog);
    return () => {
      window.removeEventListener('keydown', closeDialog);
    };
  }, [onClose]);

  return (
    <div className={`dialog ${!isOpen ? "hidden" : ""}`}>
      <div className="dialog-panel">

        <div className='header'>
          <h2>{title}</h2>
          <IoMdClose onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default Dialog