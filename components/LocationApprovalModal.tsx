import React from "react";

interface LocationApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const LocationApprovalModal: React.FC<LocationApprovalModalProps> = ({ isOpen, onClose, onApprove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Location Required</h2>
        <p className="mb-4">Location is required to submit the survey. Please approve the location to proceed.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Approve Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationApprovalModal;