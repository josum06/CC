import React from 'react';

const GroupInfoModal = ({
  selectedChat,
  setShowGroupInfo,
  setShowAddMembers,
  setRemovingMember,
  handleMakeAdmin
}) => {
  const isAdmin = selectedChat.members.some(
    member => member.id === 'currentUser' && member.role === 'admin'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Group Info</h2>
            <button
              onClick={() => setShowGroupInfo(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{selectedChat.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.members.length} members
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddMembers(true)}
                  className="flex items-center space-x-2 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Members</span>
                </button>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Members</h4>
              <div className="space-y-2">
                {selectedChat.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-gray-500 ml-2 capitalize">
                          {member.role}
                        </span>
                      </div>
                    </div>
                    
                    {isAdmin && member.id !== 'currentUser' && (
                      <div className="flex items-center space-x-2">
                        {member.role !== 'admin' && (
                          <button
                            onClick={() => handleMakeAdmin(member.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Make Admin
                          </button>
                        )}
                        <button
                          onClick={() => setRemovingMember(member)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal; 