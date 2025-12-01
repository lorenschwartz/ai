import React, { useState } from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { CustomerSetup } from './components/CustomerSetup';
import { ChatInterface } from './components/ChatInterface';
import { MenuDisplay } from './components/menu/MenuDisplay';
import { ConfigurationStudio } from './components/config';
import { Settings } from 'lucide-react';

type AppMode = 'customer' | 'config';

const AppContent: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('customer');
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

  // Configuration Studio mode
  if (mode === 'config') {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setMode('customer')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
          >
            ← Back to Customer View
          </button>
        </div>
        <ConfigurationStudio />
      </div>
    );
  }

  // Customer-facing mode
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>AI-Mi</h1>
              <p className='text-gray-600'>
                Your AI-Powered Restaurant Assistant
              </p>
            </div>
            <div className="flex items-center gap-3">
              {customerId && (
                <button
                  onClick={handleReset}
                  className='px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
                >
                  New Session
                </button>
              )}
              <button
                onClick={() => setMode('config')}
                className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200'
                title="Configuration Studio"
              >
                <Settings className="h-4 w-4" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {!customerId ? (
          <div className='max-w-md mx-auto'>
            <CustomerSetup onCustomerCreated={handleCustomerCreated} />
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]'>
            <div className='lg:col-span-2'>
              <MenuDisplay className='h-full overflow-y-auto' />
            </div>
            <div>
              <ChatInterface
                customerId={customerId}
                conversationId={conversationId || undefined}
                onConversationStart={handleConversationStart}
                className='h-full'
              />
            </div>
          </div>
        )}
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
