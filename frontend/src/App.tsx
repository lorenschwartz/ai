import React, { useState } from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { CustomerSetup } from './components/CustomerSetup';
import { ChatInterface } from './components/ChatInterface';
import { useAIHealth } from './hooks/useApi';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

// System Status Component
const SystemStatus: React.FC = () => {
  const { data: aiHealth, isLoading } = useAIHealth();

  const getStatusIcon = (status: boolean | undefined, loading: boolean) => {
    if (loading) return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
    if (status) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (status: boolean | undefined, loading: boolean) => {
    if (loading) return 'Checking...';
    if (status) return 'Online';
    return 'Offline';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-medium text-gray-900 mb-3">System Status</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Frontend</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">Online</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Backend API</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(true, false)}
            <span className={`text-sm ${true ? 'text-green-600' : 'text-red-600'}`}>
              {getStatusText(true, false)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">AI Service</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(aiHealth?.success && aiHealth?.data?.openai, isLoading)}
            <span className={`text-sm ${
              aiHealth?.success && aiHealth?.data?.openai ? 'text-green-600' : 'text-red-600'
            }`}>
              {getStatusText(aiHealth?.success && aiHealth?.data?.openai, isLoading)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleCustomerCreated = (id: string) => {
    setCustomerId(id);
  };

  const handleConversationStart = (id: string) => {
    setConversationId(id);
  };

  const handleReset = () => {
    setCustomerId(null);
    setConversationId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI-Mi</h1>
              <p className="text-gray-600">Your AI-Powered Restaurant Assistant</p>
            </div>
            {customerId && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                New Session
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!customerId ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to the Future of Dining
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Experience personalized service with our AI restaurant assistant. 
                    Get menu recommendations, place orders, and have all your dietary 
                    needs understood instantly.
                  </p>
                </div>
                <CustomerSetup onCustomerCreated={handleCustomerCreated} />
              </div>
            ) : (
              <div className="h-[calc(100vh-16rem)]">
                <ChatInterface
                  customerId={customerId}
                  conversationId={conversationId || undefined}
                  onConversationStart={handleConversationStart}
                  className="h-full"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SystemStatus />
            
            {/* Features */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">AI Capabilities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Menu recommendations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Dietary restriction handling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Allergy awareness
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Order assistance
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Natural conversation
                </li>
              </ul>
            </div>

            {customerId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-100 rounded">
                    "Show me the menu"
                  </button>
                  <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-100 rounded">
                    "What's popular today?"
                  </button>
                  <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-100 rounded">
                    "I have allergies to nuts"
                  </button>
                  <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-100 rounded">
                    "I'd like to place an order"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
};

export default App;