import React from 'react';
import InteractionForm from './components/InteractionForm';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 md:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              CRM Portal
            </h1>
            <p className="text-sm text-gray-500 font-medium hidden sm:block">Intelligent Field Force Assistant</p>
          </div>
          

        </div>
      </header>
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] w-full">
          {/* Left Panel: Form */}
          <div className="w-full lg:w-3/5 h-full transition-all duration-300">
            <InteractionForm />
          </div>
          
          {/* Right Panel: Chat Assistant */}
          <div className="w-full lg:w-2/5 h-full transition-all duration-300">
            <ChatAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
