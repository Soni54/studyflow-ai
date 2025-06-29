
import React, { useState, useEffect, useRef } from 'react';
import aiService from '../services/aiService';
import authService from '../services/authService';

const AIChatbot = () => {
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const checkUserRole = async () => {
            const user = await authService.getCurrentUser();
            if (user?.role === 'student') setIsStudent(true);
            else {
                setIsStudent(false);
                setError('You must be logged in as a student to use the AI Chatbot.');
            }
        };
        checkUserRole();

        // Setup Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setPrompt((prev) => prev + ' ' + transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech Recognition Error:', event.error);
                setError('Speech recognition error. Try again.');
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setError('');
            recognitionRef.current.start();
        } else {
            setError('Speech recognition is not supported in this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        if (!isStudent) {
            setError('Please log in as a student to use the AI Chatbot.');
            return;
        }

        const newChatHistory = [...chatHistory, { type: 'user', text: prompt }];
        setChatHistory(newChatHistory);
        setLoading(true);
        setError('');

        try {
            const response = await aiService.getAIChatResponse(prompt);
            setChatHistory([...newChatHistory, { type: 'ai', text: response.answer }]);
            setPrompt('');
        } catch (err) {
            setError(err.message || 'Unknown error');
            setChatHistory([...newChatHistory, { type: 'error', text: `AI Error: ${err}` }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isStudent) {
        return (
            <div className="p-5 border border-gray-300 rounded-lg mt-5 max-w-xl mx-auto">
                <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-5 border border-gray-300 rounded-lg mt-5 max-w-xl mx-auto bg-white shadow">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">AI Chatbot - Your Virtual Tutor</h3>
            <div className="h-72 overflow-y-auto border border-gray-200 p-3 mb-4 bg-gray-50 rounded">
                {chatHistory.length === 0 && (
                    <p className="text-center text-gray-700">Ask me anything about your studies!</p>
                )}
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-3 rounded-2xl max-w-[80%] break-words text-black ${
                            msg.type === 'user'
                                ? 'bg-cyan-100 self-end ml-auto text-right'
                                : msg.type === 'ai'
                                ? 'bg-green-100 self-start'
                                : 'bg-red-100 text-red-700 self-start'
                        }`}
                    >
                        <strong>
                            {msg.type === 'user'
                                ? 'You'
                                : msg.type === 'ai'
                                ? 'AI Tutor'
                                : 'Error'}
                            :
                        </strong>{' '}
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="text-center text-gray-700">AI is thinking...</div>}
            </div>
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask your question..."
                    disabled={loading}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="button"
                    onClick={startListening}
                    disabled={isListening || loading}
                    className={`px-3 bg-gray-200 hover:bg-gray-300 border-y border-gray-300 ${
                        isListening ? 'text-red-500' : 'text-gray-600'
                    }`}
                    title="Start voice input"
                >
                    🎤
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Ask'}
                </button>
            </form>
            {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
    );
};

export default AIChatbot;

