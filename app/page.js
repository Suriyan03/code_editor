"use client";
import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css'; 
import { Play, Wrench, HelpCircle, X, Send, MessageSquare, Terminal, ChevronRight } from 'lucide-react';
import { autoFixCode, getHelpResponse } from './utils';

export default function Home() {
  const [code, setCode] = useState(`// Write your JavaScript here\n\nfunction calculate() {\n  let x = 10\n  if(x > 5) {\n    console.log("X is greater than 5")\n  }\n}\n\ncalculate()`);
  const [output, setOutput] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpQuery, setHelpQuery] = useState('');
  const [helpMessages, setHelpMessages] = useState([
    { type: 'bot', text: 'Hi! Ask me about loops, variables, or functions.' }
  ]);
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [helpMessages, isHelpOpen]);

  // --- RUN CODE ---
  const runCode = () => {
    setOutput([]); 
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(' '));
    };

    try {
      new Function(code)(); 
      setOutput(logs.length ? logs : ['Code ran successfully (No output)']);
    } catch (error) {
      setOutput([`Error: ${error.message}`]);
    } finally {
      console.log = originalLog; 
    }
  };

  // --- AUTO-FIX ---
  const handleAutoFix = () => {
    const fixed = autoFixCode(code);
    setCode(fixed);
  };

  // --- HELP SYSTEM ---
  const handleAskHelp = (e) => {
    e.preventDefault();
    if (!helpQuery.trim()) return;

    setHelpMessages(prev => [...prev, { type: 'user', text: helpQuery }]);
    const response = getHelpResponse(helpQuery);
    
    setTimeout(() => {
      setHelpMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
    
    setHelpQuery('');
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-gray-300 font-sans overflow-hidden">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] flex justify-between items-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500"/>
          <div className="w-3 h-3 rounded-full bg-green-500"/>
          <span className="ml-3 font-mono text-sm font-bold text-gray-100">DevEditor_v1</span>
        </div>
        
        <div className="flex gap-3">
          {/* UPDATED: WHITE BUTTON */}
          <button onClick={handleAutoFix} className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-200 border border-gray-300 rounded-md text-xs text-black font-bold transition-all shadow-md">
            <Wrench size={14} className="text-black"/> Auto-Fix
          </button>
          
          <button onClick={() => setIsHelpOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-md text-xs text-white transition-all shadow-lg shadow-blue-900/20">
            <HelpCircle size={14} /> AI Help
          </button>

          <button onClick={runCode} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 border border-green-500 rounded-md text-xs text-white font-bold tracking-wide transition-all shadow-lg shadow-green-900/20">
            <Play size={14} fill="currentColor" /> RUN
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT (VERTICAL STACK) */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* TOP: CODE EDITOR */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117]">
          <div className="bg-[#0d1117] border-b border-[#30363d] px-4 py-2 flex items-center text-xs text-gray-400 select-none">
            <span className="bg-[#1f2428] px-3 py-1 rounded-t-md border-t border-l border-r border-[#30363d] text-white">script.js</span>
          </div>
          <div className="flex-1 overflow-auto relative font-mono text-sm">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, languages.js)}
              padding={24}
              className="min-h-full"
              style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: 15, lineHeight: '1.6' }}
            />
          </div>
        </div>

        {/* BOTTOM: TERMINAL */}
        <div className="h-[35%] bg-black border-t border-[#30363d] flex flex-col shrink-0">
          <div className="px-4 py-1.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between select-none">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
               <Terminal size={14} /> Terminal / Output
             </div>
             <button onClick={() => setOutput([])} className="text-[10px] hover:text-white transition-colors">CLEAR</button>
          </div>
          
          <div className="flex-1 p-4 overflow-auto font-mono text-sm text-green-400 bg-[#0d1117]">
             {output.length === 0 ? (
               <div className="opacity-40 flex flex-col gap-1">
                 <span>$ ready to compile...</span>
                 <span>$ waiting for input...</span>
               </div>
             ) : (
               output.map((line, i) => (
                 <div key={i} className="flex gap-2 items-start mb-1 hover:bg-[#161b22] px-1 -mx-1 rounded">
                   <span className="text-gray-600 mt-0.5"><ChevronRight size={14}/></span>
                   <span>{line}</span>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>

      {/* 3. CENTERED MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161b22] w-full max-w-lg h-[600px] flex flex-col rounded-xl border border-[#30363d] shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#21262d] p-4 rounded-t-xl border-b border-[#30363d] flex justify-between items-center shrink-0">
              <h2 className="text-white font-bold flex items-center gap-2 text-sm">
                <MessageSquare size={16} className="text-blue-400"/> AI Assistant
              </h2>
              <button onClick={() => setIsHelpOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0d1117]">
              {helpMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    msg.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-[#21262d] text-gray-200 rounded-bl-none border border-[#30363d]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskHelp} className="p-3 bg-[#161b22] border-t border-[#30363d] rounded-b-xl flex gap-2 shrink-0">
              <input
                type="text"
                value={helpQuery}
                onChange={(e) => setHelpQuery(e.target.value)}
                placeholder="Type your question..."
                /* White text enforced here */
                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600"
                autoFocus
              />
              <button type="submit" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 text-white transition-colors">
                <Send size={18} />
              </button>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
}