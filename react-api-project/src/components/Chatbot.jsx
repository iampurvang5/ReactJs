import React, { useState, useRef, useEffect } from 'react';
import chatbotResponses from '../chatbot_responses.json';

const Chatbot = ({ isDetailPage = false }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'seen' },
    { id: 2, text: 'Hello! How can I help you today?', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'seen' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);


  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { id: Date.now(), text: input, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      setTimeout(() => {
        setMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
          );
          return updatedMessages;
        });
      }, 1000);

      setTimeout(() => {
        setMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'seen' } : msg
          );
          return updatedMessages;
        });
      }, 2000);

      setTimeout(() => {
        // Match user input to responses
        const lowerInput = input.toLowerCase().trim();
        let botResponse = chatbotResponses.default;

        // Check greetings
        if (chatbotResponses.greetings[lowerInput]) {
          botResponse = chatbotResponses.greetings[lowerInput];
        }
        // Check questions
        else if (chatbotResponses.questions[lowerInput]) {
          botResponse = chatbotResponses.questions[lowerInput];
        }
        // Check thanks
        else if (chatbotResponses.thanks[lowerInput]) {
          botResponse = chatbotResponses.thanks[lowerInput];
        }

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'seen' },
        ]);
      }, 1000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'seen':
        return <span className="text-blue-500">✓✓</span>;
      default:
        return '';
    }
  };

  return (
    <div className={`w-full mx-auto scrollbar-hide ${isDetailPage ? 'p-3 min-h-[500px] max-w-[500px] bg-white rounded-lg shadow-lg flex flex-col' : 'p-2 h-48 overflow-auto bg-gray-100 rounded'}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Chatbot</h2>
      <div className="flex-1 overflow-auto mb-4 space-y-2 p-2 bg-gray-50 rounded-lg shadow-inner max-h-[500px] scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg flex flex-col transition-opacity duration-300 opacity-100 animate-fadeIn
              ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-900 mr-6'}`}
            style={{
              maxWidth: 'fit-content',
              minWidth: 'fit-content',
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              marginLeft: msg.text.length > 50 && msg.sender === 'user' ? '3rem' : msg.sender === 'user' ? 'auto' : '0',
            }}
          >
            <span>{msg.text}</span>
            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
              <span>{msg.time}</span>
              {msg.sender === 'user' && <span className="ml-1">{getStatusIcon(msg.status)}</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="border-2 border-gray-300 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send
          </button>
        </div>
      
    </div>
  );
};

export default Chatbot;