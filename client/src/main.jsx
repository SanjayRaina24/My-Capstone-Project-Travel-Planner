import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "747225530500-qdjlh4s7s37nn7pvmbqupo7hpr5gioqr.apps.googleusercontent.com"; 

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
} catch (error) {
  root.render(
    <div style={{ color: 'red', padding: '2rem' }}>
      <h1>Startup Error</h1>
      <p>{error.message}</p>
    </div>
  );
}