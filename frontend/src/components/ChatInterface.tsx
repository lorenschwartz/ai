// AI Chat Interface Component
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, Bot, Loader2 } from 'lucide-react';
import { 
  useConversationMessages, 
  useStartConversationWithMessage, 
  useChatWithAI,
  useCustomer 
} from '../hooks/useApi';
import type { ConversationMessage } from '../types/api';

interface ChatInterfaceProps {
  customerId: string;
  conversationId?: string;
  onConversationStart?: (conversationId: string) => void;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  customerId,
  conversationId: initialConversationId,
  onConversationStart,
  className = '',
}) => {
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: customer } = useCustomer(customerId);
  const { 
    data: messagesResponse, 
    isLoading: messagesLoading,
    error: messagesError 
  } = useConversationMessages(conversationId || '');

  // Mutations
  const startConversationMutation = useStartConversationWithMessage();
  const chatMutation = useChatWithAI();

  const messages = messagesResponse?.success ? messagesResponse.data || [] : [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      if (!conversationId) {
        // Start new conversation with the message
        const result = await startConversationMutation.mutateAsync({
          customerId,
          message: messageText,
        });

        if (result.success && result.data) {
          const newConversationId = result.data.conversation.id;
          setConversationId(newConversationId);
          onConversationStart?.(newConversationId);
        }
      } else {
        // Send message in existing conversation
        await chatMutation.mutateAsync({
          conversationId,
          message: messageText,
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // You might want to show an error toast here
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Loading state
  if (messagesLoading && conversationId) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading conversation...</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
        <div>
          <h3 className="font-medium text-gray-900">AI Restaurant Assistant</h3>
          {customer?.data && (
            <p className="text-sm text-gray-500">
              Chatting with {customer.data.name}
              {customer.data.tableNumber && ` • Table ${customer.data.tableNumber}`}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messagesError && (
          <div className="text-center text-red-500 p-4">
            Failed to load messages. Please try again.
          </div>
        )}

        {messages.length === 0 && !messagesError && (
          <div className="text-center text-gray-500 p-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Welcome to AI-Mi!</p>
            <p className="text-sm mt-2">
              I'm your AI restaurant assistant. Ask me about our menu, make an order, 
              or let me know if you have any dietary restrictions or preferences.
            </p>
          </div>
        )}

        {messages.map((message: ConversationMessage) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                {message.role === 'user' ? (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex mr-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about our menu, place an order, or tell me your preferences..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={startConversationMutation.isLoading || chatMutation.isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              !inputMessage.trim() || 
              startConversationMutation.isLoading || 
              chatMutation.isLoading
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {startConversationMutation.isLoading || chatMutation.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;