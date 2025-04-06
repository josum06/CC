import React from 'react';

const RemoveMemberModal = ({
  removingMember,
  setRemovingMember,
  handleRemoveMember
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-4">Remove Member</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to remove {removingMember.name} from the group?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setRemovingMember(null)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => handleRemoveMember(removingMember.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveMemberModal; 