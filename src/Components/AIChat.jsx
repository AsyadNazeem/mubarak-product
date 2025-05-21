import React, {useEffect, useRef, useState} from 'react';
import {ChevronDown, ChevronUp, ExternalLink, Loader, MessageSquare, Send, Trash2, Volume2, X} from 'lucide-react';
import {Link} from 'react-router-dom';
import chatService from '../services/chatService';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! I'm your Mubarak Products assistant. How can I help you today?",
            sender: 'ai'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [suggestions, setSuggestions] = useState([
        "What products do you offer?",
        "How long is delivery?",
        "How can I contact support?"
    ]);
    const [lastIntent, setLastIntent] = useState({category: 'greeting', intent: 'hello'});
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showVoiceInput, setShowVoiceInput] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Load chat history on initial render
    useEffect(() => {
        const savedHistory = chatService.loadChatHistory();
        if (savedHistory && savedHistory.length > 0) {
            setMessages(savedHistory);

            // Set the last intent based on the final AI message
            const lastAiMessage = [...savedHistory].reverse().find(msg => msg.sender === 'ai');
            if (lastAiMessage && lastAiMessage.intent) {
                setLastIntent(lastAiMessage.intent);
                setSuggestions(chatService.getSuggestions(lastAiMessage.intent));
            }
        }
    }, []);

    // Save chat history whenever messages change
    useEffect(() => {
        if (messages.length > 1) { // Don't save if only the welcome message exists
            chatService.saveChatHistory(messages);
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;

        // Add user message
        const newUserMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Process with our chat service
        const intent = chatService.detectIntent(inputMessage);
        setLastIntent(intent);

        // Simulate AI thinking and response
        setTimeout(() => {
            const response = chatService.getResponse(intent);

            const newAIMessage = {
                id: messages.length + 2,
                text: response.text,
                sender: 'ai',
                product: response.product || null,
                showProducts: response.showProducts || false,
                showProductsLink: response.showProductsLink || false,
                showContactLink: response.showContactLink || false,
                showSuggestions: response.showSuggestions || false,
                intent: intent
            };

            setMessages(prev => [...prev, newAIMessage]);
            setSuggestions(chatService.getSuggestions(intent));
            setIsTyping(false);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setMinimized(false);
            // Focus input after opening
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
        }
    };

    const toggleMinimize = (e) => {
        e.stopPropagation();
        setMinimized(!minimized);
    };

    const clearChat = () => {
        setMessages([{
            id: 1,
            text: "Hi there! I'm your Mubarak Products assistant. How can I help you today?",
            sender: 'ai'
        }]);
        setLastIntent({category: 'greeting', intent: 'hello'});
        setSuggestions([
            "What products do you offer?",
            "How long is delivery?",
            "How can I contact support?"
        ]);
        chatService.clearChatHistory();
    };

    // Voice input handling
    const toggleVoiceInput = () => {
        if (!showVoiceInput) {
            setShowVoiceInput(true);

            // Check if browser supports speech recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                startListening();
            } else {
                alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
                setShowVoiceInput(false);
            }
        } else {
            stopListening();
            setShowVoiceInput(false);
        }
    };

    const startListening = () => {
        // This is just simulated in this example
        // In a real implementation, you would use the Web Speech API
        setIsListening(true);
        // Simulate listening for 5 seconds then getting a result
        setTimeout(() => {
            const fakeVoiceInput = "Do you have fish fry products?";
            setInputMessage(fakeVoiceInput);
            setIsListening(false);
            setShowVoiceInput(false);
        }, 3000);
    };

    const stopListening = () => {
        // In a real implementation, you would stop the speech recognition here
        setIsListening(false);
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!minimized && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages, minimized]);

    // ProductCard component for rich product responses
    const ProductCard = ({product}) => (
        <div className="border border-gray-200 rounded-md mt-2 bg-white shadow-sm overflow-hidden">
            <div className="p-3">
                <h4 className="font-medium text-[#912923]">{product.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                {product.price && (
                    <p className="text-sm font-medium mt-1">₹{product.price}</p>
                )}
                {product.image && (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover mt-2 rounded"
                    />
                )}
                <div className="mt-2 flex justify-end">
                    <Link
                        to={`/products/${product.id}`}
                        className="text-sm text-[#912923] flex items-center hover:underline"
                    >
                        View details
                        <ExternalLink size={14} className="ml-1"/>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Chat Icon to open the chat */}
            <div
                className={`fixed bottom-4 right-4 z-50 bg-[#912923] text-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300 ${isOpen ? 'rotate-360' : 'hover:bg-[#7e231f]'}`}
                onClick={toggleChat}
            >
                <MessageSquare size={24}/>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-20 right-4 z-50 w-80 md:w-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Chat Header */}
                    <div className="bg-[#912923] text-white p-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <MessageSquare size={20} className="mr-2"/>
                            <h3 className="font-medium">Mubarak Products Chat</h3>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={toggleMinimize}
                                className="text-white hover:text-gray-200 mr-2"
                            >
                                {minimized ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>
                            <button
                                onClick={clearChat}
                                className="text-white hover:text-gray-200 mr-2"
                                title="Clear chat history"
                            >
                                <Trash2 size={18}/>
                            </button>
                            <button
                                onClick={toggleChat}
                                className="text-white hover:text-gray-200"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    {!minimized && (
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50" style={{maxHeight: '400px'}}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-3 ${message.sender === 'user' ? 'text-right' : ''}`}
                                >
                                    <div
                                        className={`inline-block rounded-lg p-2 max-w-[80%] ${
                                            message.sender === 'user'
                                                ? 'bg-[#912923] text-white rounded-tr-none'
                                                : 'bg-gray-200 text-gray-800 rounded-tl-none'
                                        }`}
                                    >
                                        {message.text}
                                    </div>

                                    {message.product && (
                                        <ProductCard product={message.product}/>
                                    )}

                                    {message.showProductsLink && (
                                        <div className="mt-2 text-left">
                                            <Link
                                                to="/products"
                                                className="text-[#912923] hover:underline flex items-center text-sm"
                                            >
                                                <ExternalLink size={14} className="mr-1"/>
                                                View all products
                                            </Link>
                                        </div>
                                    )}

                                    {message.showContactLink && (
                                        <div className="mt-2 text-left">
                                            <Link
                                                to="/contact"
                                                className="text-[#912923] hover:underline flex items-center text-sm"
                                            >
                                                <ExternalLink size={14} className="mr-1"/>
                                                Contact Us
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="mb-3">
                                    <div
                                        className="inline-block rounded-lg p-2 bg-gray-200 text-gray-800 rounded-tl-none">
                                        <div className="flex items-center">
                                            <Loader size={16} className="animate-spin mr-2"/>
                                            <span>Typing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef}/>
                        </div>
                    )}

                    {/* Suggestions */}
                    {!minimized && suggestions.length > 0 && (
                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full border border-gray-300"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Input */}
                    {!minimized && (
                        <div className="border-t border-gray-200 p-3 bg-white">
                            {showVoiceInput ? (
                                <div className="flex items-center justify-center py-2">
                                    {isListening ? (
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                                                <Volume2 size={24} className="text-red-500"/>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">Listening...</p>
                                            <button
                                                onClick={stopListening}
                                                className="mt-2 text-sm text-red-500 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Volume2 size={20} className="text-gray-500 mr-2"/>
                                            <p className="text-sm text-gray-600">Preparing voice input...</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center">
                  <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 text-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#912923] resize-none"
                      rows={1}
                  />
                                    <button
                                        onClick={toggleVoiceInput}
                                        className="ml-2 text-gray-500 hover:text-[#912923]"
                                    >
                                        <Volume2 size={20}/>
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={inputMessage.trim() === ''}
                                        className={`ml-2 ${
                                            inputMessage.trim() === ''
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-[#912923] hover:text-[#7e231f]'
                                        }`}
                                    >
                                        <Send size={20}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AIChat
