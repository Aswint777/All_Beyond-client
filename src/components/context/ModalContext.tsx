import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  message?: string;
  openModal: (onConfirm: () => void, message?: string) => void;
  closeModal: () => void;
  confirmAction: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});

  const openModal = (onConfirm: () => void, msg?: string) => {
    setConfirmAction(() => onConfirm);
    setMessage(msg);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, confirmAction }}>
      {children}

      {/* Global Logout Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
            {/* Header */}
            <div className="flex justify-center pt-6">
              <span className="text-4xl text-yellow-500">⚠️</span>
            </div>
            {/* Body */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message || "Are you sure?"}
              </p>
            </div>
            {/* Footer */}
            <div className="flex justify-center space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  confirmAction();
                  closeModal();
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};