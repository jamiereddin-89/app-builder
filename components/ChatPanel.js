import React, { useRef, useEffect } from 'react';

/**
 * Individual chat message component
 * Displays user/AI messages with suggestions and timestamps
 * @param {Object} message - Message object
 * @param {string} message.role - Message sender ('user' or 'assistant')
 * @param {string} message.content - Message text content
 * @param {number} message.timestamp - Message timestamp
 * @param {Array} message.suggestions - Optional AI suggestions
 * @param {Function} onApplySuggestion - Apply suggestion callback
 * @param {boolean} darkMode - Dark mode theme setting
 * @returns {JSX.Element} Chat message element
 * @example
 * <ChatMessage
 *   message={chatMessage}
 *   onApplySuggestion={handleSuggestion}
 * />
 */
function ChatMessage({ message, onApplySuggestion, darkMode }) {
  const isUser = message.role === "user";
  const timeStr = new Date(message.timestamp).toLocaleTimeString();
  
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  
  return React.createElement(
    'div',
    { className: `flex ${isUser ? "justify-end" : "justify-start"} mb-4` },
    React.createElement(
      'div',
      { className: `max-w-[80%] ${isUser ? "order-2" : "order-1"}` },
      React.createElement(
        'div',
        { className: `flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}` },
        React.createElement(
          'div',
          { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isUser ? "bg-[#dc2626] text-white" : "bg-[#22c55e] text-white"}` },
          isUser ? "U" : "AI"
        ),
        React.createElement(
          'div',
          { className: `rounded-2xl p-3 ${isUser ? "bg-[#dc2626] text-white" : `${neuInset} ${textPrimary}`}` },
          React.createElement('div', { className: "text-sm whitespace-pre-wrap" }, message.content),
          React.createElement('div', { className: `text-xs mt-1 ${isUser ? "text-red-100" : textSecondary}` }, timeStr)
        )
      ),
      
      // Suggestions
      message.suggestions && message.suggestions.length > 0 && React.createElement(
        'div',
        { className: "mt-3 space-y-2" },
        message.suggestions.map((suggestion, index) =>
          React.createElement(
            'div',
            { key: index, className: `${neuInset} rounded-xl p-3` },
            React.createElement('div', { className: `text-sm ${textSecondary} mb-2` }, `💡 ${suggestion.explanation}`),
            suggestion.code && React.createElement(
              'div',
              { className: "flex gap-2" },
              React.createElement(
                'button',
                {
                  onClick: () => onApplySuggestion(suggestion),
                  disabled: suggestion.applied,
                  className: `${neuBtn} rounded-lg px-3 py-1 text-xs font-bold ${textPrimary} disabled:opacity-50`
                },
                suggestion.applied ? "✓ Applied" : "Apply Changes"
              )
            )
          )
        )
      )
    )
  );
}

/**
 * Chat input component for sending messages
 * Handles text input with Enter key submission and disabled states
 * @param {string} value - Current input value
 * @param {Function} onChange - Input change callback
 * @param {Function} onSend - Send message callback
 * @param {boolean} disabled - Whether input is disabled
 * @param {boolean} darkMode - Dark mode theme setting
 * @returns {JSX.Element} Chat input element
 * @example
 * <ChatInput
 *   value={inputValue}
 *   onChange={handleChange}
 *   onSend={handleSend}
 * />
 */
function ChatInput({ value, onChange, onSend, disabled, darkMode }) {
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  return React.createElement(
    'div',
    { className: `${neuInset} rounded-2xl p-3 flex items-end gap-2` },
    React.createElement('textarea', {
      value: value,
      onChange: (e) => onChange(e.target.value),
      onKeyPress: handleKeyPress,
      placeholder: "Ask AI to improve your app...",
      disabled: disabled,
      className: `flex-1 bg-transparent ${textPrimary} border-0 outline-none resize-none placeholder-[#999]`,
      rows: "1",
      style: { minHeight: '20px', maxHeight: '80px' }
    }),
    React.createElement(
      'button',
      {
        onClick: onSend,
        disabled: disabled || !value.trim(),
        className: `${neuBtn} rounded-xl p-2 ${textPrimary} disabled:opacity-50`
      },
      disabled ? "⏳" : "📤"
    )
  );
}

/**
 * Main chat panel component for AI assistant interactions
 * Manages chat history, input, and AI conversation functionality
 * @param {Object} props - Component props
 * @param {boolean} props.isChatVisible - Whether chat panel is visible
 * @param {Array<Object>} props.chatHistory - Chat message history
 * @param {string} props.chatInput - Current chat input value
 * @param {boolean} props.isChatLoading - AI response loading state
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onSetIsChatVisible - Toggle chat visibility
 * @param {Function} props.onSetChatInput - Set chat input value
 * @param {Function} props.onIterateOnApp - AI app iteration callback
 * @param {Function} props.onApplySuggestion - Apply AI suggestion callback
 * @returns {JSX.Element} Chat panel element or floating button when hidden
 * @example
 * <ChatPanel
 *   isChatVisible={true}
 *   chatHistory={messages}
 *   onIterateOnApp={handleIteration}
 * />
 */
export function ChatPanel({
  // State
  isChatVisible,
  chatHistory,
  chatInput,
  isChatLoading,
  darkMode,
  
  // Handlers
  onSetIsChatVisible,
  onSetChatInput,
  onIterateOnApp,
  onApplySuggestion
}) {
  const messagesEndRef = useRef(null);
  
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  
  const handleSendMessage = () => {
    if (chatInput.trim() && !isChatLoading) {
      onIterateOnApp(chatInput);
    }
  };
  
  if (!isChatVisible) {
    return React.createElement(
      'button',
      {
        onClick: () => onSetIsChatVisible(true),
        className: `${neuBtn} rounded-full w-12 h-12 flex items-center justify-center text-xl ${textPrimary} mb-4`,
        title: "Open AI Chat"
      },
      "💬"
    );
  }
  
  return React.createElement(
    'div',
    { className: `${neu} rounded-[24px] p-4 mb-6` },
    React.createElement(
      'div',
      { className: "flex items-center justify-between mb-4" },
      React.createElement(
        'h3',
        { className: `font-black ${textPrimary} flex items-center gap-2` },
        React.createElement('span', { className: "text-[#22c55e]" }, "🤖"),
        "AI Assistant"
      ),
      React.createElement(
        'button',
        {
          onClick: () => onSetIsChatVisible(false),
          className: `${neuBtn} rounded-full w-8 h-8 flex items-center justify-center text-sm ${textPrimary}`
        },
        "×"
      )
    ),
    
    // Chat Messages
    React.createElement(
      'div',
      { className: "h-64 overflow-y-auto mb-4 space-y-2" },
      chatHistory.length === 0 ? React.createElement(
        'div',
        { className: `text-center ${textSecondary} py-8` },
        React.createElement('div', { className: "text-3xl mb-2" }, "🤖"),
        React.createElement('div', { className: "text-sm" }, "Start a conversation to improve your app!")
      ) : chatHistory.map((message, index) =>
        React.createElement(
          ChatMessage,
          {
            key: index,
            message: message,
            onApplySuggestion: onApplySuggestion,
            darkMode: darkMode
          }
        )
      ),
      isChatLoading && React.createElement(
        'div',
        { className: "flex justify-start mb-4" },
        React.createElement(
          'div',
          { className: "flex items-center gap-2" },
          React.createElement('div', { className: "w-8 h-8 rounded-full bg-[#22c55e] text-white flex items-center justify-center text-sm font-bold" }, "AI"),
          React.createElement(
            'div',
            { className: `${neuInset} rounded-2xl p-3 ${textPrimary}` },
            React.createElement(
              'div',
              { className: "flex items-center gap-1" },
              React.createElement('div', { className: "w-2 h-2 bg-[#22c55e] rounded-full animate-bounce" }),
              React.createElement('div', { className: "w-2 h-2 bg-[#22c55e] rounded-full animate-bounce", style: { animationDelay: '0.1s' } }),
              React.createElement('div', { className: "w-2 h-2 bg-[#22c55e] rounded-full animate-bounce", style: { animationDelay: '0.2s' } })
            )
          )
        )
      ),
      React.createElement('div', { ref: messagesEndRef })
    ),
    
    // Chat Input
    React.createElement(
      ChatInput,
      {
        value: chatInput,
        onChange: onSetChatInput,
        onSend: handleSendMessage,
        disabled: isChatLoading,
        darkMode: darkMode
      }
    )
  );
}