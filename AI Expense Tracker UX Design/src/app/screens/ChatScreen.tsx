import React, { useState, useEffect, useRef } from 'react';
import { getChatHistory, saveChatMessage, getExpenses, getGoals } from '../utils/storage';
import { generateChatResponse } from '../utils/ai';
import { ChatMessage } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Bot, User } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'How much did I spend this month?',
  'What is my highest spending category?',
  'Show me my savings progress',
];

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = () => {
    const history = getChatHistory();
    
    if (history.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hi! I'm your AI expense assistant. I can help you understand your spending patterns, track goals, and provide financial insights. How can I help you today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      saveChatMessage(welcomeMessage);
    } else {
      setMessages(history);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (query?: string) => {
    const messageText = query || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    saveChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Get expenses and goals for context
      const expenses = getExpenses();
      const goals = getGoals();

      // Generate response
      const response = generateChatResponse(messageText, expenses, goals);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      saveChatMessage(assistantMessage);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <p className="text-sm text-white/90">Ask me about your expenses</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' 
                ? 'bg-blue-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            
            <div
              className={`max-w-[75%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSend(suggestion)}
                className="px-3 py-1.5 bg-white text-sm text-gray-700 rounded-full border hover:bg-gray-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
