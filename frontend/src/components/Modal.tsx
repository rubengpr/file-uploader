import React from 'react';

interface ModalProps {
  modalTitle: string;
  modalText: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ modalTitle, modalText, children, onClose }: ModalProps) {
  
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  };

  return (
      <div className="fixed inset-0 bg-black/50 z-40">
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
            <div className="p-6 rounded-lg shadow-lg bg-neutral-700 flex flex-col items-center">
                <h1 className="text-3xl mb-4 font-bold">{modalTitle}</h1>
                <p className="text-xs w-140 text-center">{modalText}</p>
                <div className="py-4 w-1/2">
                    {children}
                </div>
            </div>
        </div>
    </div>
  );
}
