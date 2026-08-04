import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ChatBot from './components/chatbot/ChatBot';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <ChatBot />
                <ToastContainer position="top-right" autoClose={3000} />
            </AuthProvider>
        </Router>
    );
}

export default App;
