import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🤖 AI-Mi
        </h1>
        <p className="text-gray-600 mb-6">
          Your AI-powered restaurant waiter assistant
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✅ Frontend initialized</p>
          <p>✅ Backend API ready</p>
          <p>🔨 Development in progress...</p>
        </div>
      </div>
    </div>
  );
};

export default App;