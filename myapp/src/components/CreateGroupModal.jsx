import React from 'react';

const CreateGroupModal = ({
  groupName,
  setGroupName,
  selectedMembers,
  setSelectedMembers,
  handleCreateGroup,
  setShowCreateGroup,
  contacts
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter group name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Members
            </label>
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.some(m => m.id === contact.id)}
                    onChange={() => {
                      setSelectedMembers(prev =>
                        prev.some(m => m.id === contact.id)
                          ? prev.filter(m => m.id !== contact.id)
                          : [...prev, contact]
                      );
                    }}
                    className="h-4 w-4 text-green-500"
                  />
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{contact.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCreateGroup(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal; 