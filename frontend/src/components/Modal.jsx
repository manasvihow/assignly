import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Backdrop - Change background color and add onClick to close
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            {/* Modal Content - Add onClick to prevent closing when clicking inside */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-800"
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
