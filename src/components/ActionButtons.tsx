import React from 'react';
import { Check, Flag, Eye, X } from 'lucide-react';
import { RejectModal } from './RejectModal';
import { ConfirmModal } from './ConfirmModal';

interface ActionButtonsProps {
  status: string;
  appId: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ status, appId }) => {
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [showApproveModal, setShowApproveModal] = React.useState(false);

  const handleAction = (action: string) => {
    // In a real app, this would trigger an API call
    console.log(`Action: ${action} for app ${appId}`);
  };

  const handleReject = (reason: string) => {
    console.log(`Rejecting app ${appId} with reason: ${reason}`);
    setShowRejectModal(false);
  };

  const handleApprove = () => {
    handleAction('approve');
    setShowApproveModal(false);
  };
  
  return (
    <>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setShowApproveModal(true)}
          className="px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          className="px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          Reject
        </button>
      </div>

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />

      <ConfirmModal
        isOpen={showApproveModal}
        title="Confirm"
        message="Are you sure to approve this agent?"
        confirmText="OK"
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />
    </>
  );
};