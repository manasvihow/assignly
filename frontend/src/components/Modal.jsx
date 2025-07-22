import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
    
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 transition-opacity duration-300 ease-in-out animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-scale-in"
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                    <h3 id="modal-title" className="text-xl font-semibold text-slate-800">
                        {title}
                    </h3>
    
                    <button
                        onClick={onClose}
                        className="p-1 -m-1 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;