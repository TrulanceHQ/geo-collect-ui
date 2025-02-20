import React from "react";

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionSuccessModal({ isOpen, onClose }: SubmissionSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-green-600">🎉 Submission Successful!</h2>
        <p className="text-gray-600 mt-2">Thank you for completing the survey.</p>
        
        <button 
          onClick={onClose} 
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
