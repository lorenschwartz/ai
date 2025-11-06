import React, { useState } from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { CustomerSetup } from './components/CustomerSetup';
import { ChatInterface } from './components/ChatInterface';
import { MenuDisplay } from './components/menu/MenuDisplay';

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
            {customerId && (
              <button
                onClick={handleReset}
                className='px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
              >
                New Session
              </button>
            )}
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
