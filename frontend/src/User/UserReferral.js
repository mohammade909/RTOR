import React from 'react';
const TreeNode = ({ user }) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <img
          src="/default.png"
          alt={user.name}
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <div className="absolute w-0.5 h-full bg-gray-300 left-1/2 transform -translate-x-1/2 top-10"></div>
      </div>
      <div className="ml-2">{user.name}</div>
    </div>
  );
};

const UserTree = ({ users }) => {
  return (
    <div className="flex flex-col">
      {users.map((user, index) => (
        <div key={user.id} className="flex flex-col items-center">
          <TreeNode user={user} />
          {index < users.length - 1 && <div className="h-5"></div>}
        </div>
      ))}
    </div>
  );
};

// Example usage
const users = [
  { id: 1, name: 'User 1', image: '/default.png' },
  { id: 2, name: 'User 2', image: '/default.png' },
  { id: 3, name: 'User 3', image: '/default.png' },
];

const UserReferral = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Refferal Tree</h1>
      <UserTree users={users} />
    </div>
  );
};

export default UserReferral;
