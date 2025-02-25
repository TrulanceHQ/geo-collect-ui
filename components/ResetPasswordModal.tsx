import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { updateUserPassword } from "@/services/apiService";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ResetPasswordModal = ({
  isOpen,
  onClose,
  userId,
}: ResetPasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setLoading(true);

    try {
      const data = await updateUserPassword(userId, oldPassword, newPassword);
      toast.success(data.message);
      console.log("Responses:", data);
      onClose();
    } catch (error) {
      console.error("Failed to update password from modal", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update password"
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Failed to update password");
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Password
        </h2>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Old Password:</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">New Password:</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Confirm New Password:
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
