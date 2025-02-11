import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: (onConfirm: () => void) => void;
  closeModal: () => void;
  confirmAction: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});

  const openModal = (onConfirm: () => void) => {
    setConfirmAction(() => onConfirm);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, confirmAction }}>
      {children}

      {/* Global Logout Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold mb-3">⚠️ Confirm Logout</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => { confirmAction(); closeModal(); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Yes, Logout
              </button>
              <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
