import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatMessage, updateFormData, setLoading } from '../store/interactionSlice';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChatAssistant = () => {
  const [input, setInput] = useState('');
  const chatHistory = useSelector((state) => state.interaction.chatHistory);
  const isLoading = useSelector((state) => state.interaction.isLoading);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    dispatch(addChatMessage({ sender: 'user', text: userMessage }));
    setInput('');
    dispatch(setLoading(true));

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiBaseUrl}/api/interactions/chat`, {
        message: userMessage
      });
      
      const { ai_message, updated_form_data } = response.data;
      
      if (updated_form_data && Object.keys(updated_form_data).length > 0) {
        dispatch(updateFormData(updated_form_data));
      }
      
      if (ai_message) {
         dispatch(addChatMessage({ sender: 'ai', text: ai_message }));
      } else if (Object.keys(updated_form_data).length > 0) {
         dispatch(addChatMessage({ sender: 'ai', text: 'I have updated the form fields based on your input.' }));
      } else {
         dispatch(addChatMessage({ sender: 'ai', text: "I couldn't identify any interaction details in your message." }));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      dispatch(addChatMessage({ 
        sender: 'ai', 
        text: 'Sorry, I encountered an error communicating with the server.' 
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col border border-gray-100">
      <div className="bg-slate-800 p-4 shrink-0 flex items-center shadow-md z-10">
        <div className="bg-blue-500/20 p-2 rounded-full mr-3 border border-blue-500/30">
          <Bot className="text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">AI Assistant</h2>
          <p className="text-slate-400 text-xs font-medium flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
            Online - Groq powered
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 bg-slate-50 relative custom-scrollbar flex flex-col space-y-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-600 ml-3' : 'bg-blue-600 mr-3'}`}>
                {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-3.5 rounded-2xl shadow-sm text-sm ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-blue-600 mr-3">
                <Bot size={16} className="text-white" />
              </div>
              <div className="p-3.5 rounded-2xl shadow-sm text-sm bg-white border border-gray-200 text-gray-800 rounded-tl-none flex items-center">
                <Loader2 className="animate-spin text-blue-500 mr-2" size={16} />
                Analysing...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-300 rounded-full py-3 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
            placeholder="Log interaction (e.g. 'Met Dr. Smith, discussed new drug...')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
