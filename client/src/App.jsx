import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { getTrips, createTrip, deleteTrip } from './services/api';
import TripDetails from './pages/TripDetails';
import './App.css';

// --- Components ---

const Navbar = ({ user, onLogout }) => (
  <nav className="navbar" style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '1.5rem' }}>✨</span>
      <h2 style={{ margin: 0, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>Plan Your Trip</h2>
    </div>
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <span style={{ fontWeight: '600', color: '#4b5563' }}>{user.given_name} {user.family_name}</span>
      <button 
        onClick={onLogout} 
        style={{ padding: '8px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
      >
        Logout
      </button>
    </div>
  </nav>
);

const Stats = ({ count }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '3rem' }}>
    <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#6366f1' }}>{count}</h2>
      <p style={{ margin: 0, color: '#6b7280', fontWeight: '600' }}>Total Trips</p>
    </motion.div>
    <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>12</h2>
      <p style={{ margin: 0, color: '#6b7280', fontWeight: '600' }}>Countries</p>
    </motion.div>
    <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#ec4899' }}>$4.2k</h2>
      <p style={{ margin: 0, color: '#6b7280', fontWeight: '600' }}>Budget Planned</p>
    </motion.div>
  </div>
);

const LoginPage = ({ onSuccess }) => (
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)' }}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: 'white', padding: '4rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
    >
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>✨ Plan Your Trip</h1>
      <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1.2rem' }}>Plan your next adventure with AI.</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            try { onSuccess(jwtDecode(credentialResponse.credential)); } 
            catch (err) { console.error("Login Error:", err); }
          }}
          onError={() => console.log('Login Failed')}
        />
      </div>
    </motion.div>
  </div>
);

// --- Main Dashboard ---
function Dashboard({ user, onLogout }) {
  const [trips, setTrips] = useState([]);
  const [destination, setDestination] = useState('');
  const USER_ID = user.sub;

  useEffect(() => {
    if (USER_ID) getTrips(USER_ID).then(setTrips).catch(console.error);
  }, [USER_ID]);

  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!destination) return;
    const newTrip = { userId: USER_ID, destination, startDate: new Date(), endDate: new Date() };
    try {
      const saved = await createTrip(newTrip);
      setTrips([...trips, saved]);
      setDestination('');
    } catch (err) { alert("Error saving trip"); }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    await deleteTrip(id);
    setTrips(trips.filter(t => t._id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar user={user} onLogout={onLogout} />
      
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Search Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', color: '#1f2937', marginBottom: '2rem' }}>Where to next, {user.given_name}?</h1>
          
          <form onSubmit={handleAddTrip} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <input 
              style={{ width: '100%', padding: '1.5rem 2rem', fontSize: '1.2rem', borderRadius: '50px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', outline: 'none' }}
              placeholder="Enter destination (e.g. Tokyo, Paris)..." 
              value={destination} 
              onChange={e => setDestination(e.target.value)} 
            />
            <button 
              type="submit" 
              style={{ position: 'absolute', right: '10px', top: '10px', bottom: '10px', padding: '0 2.5rem', borderRadius: '40px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
            >
              Plan
            </button>
          </form>
        </div>

        {/* Stats Row */}
        <Stats count={trips.length} />

        {/* Trips Grid */}
        <div className="grid-container">
          <AnimatePresence>
            {trips.map(trip => (
              <Link to={`/trip/${trip._id}`} key={trip._id} className="trip-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
                >
                  {/* Purple Header */}
                  <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Upcoming</span>
                    <button onClick={(e) => handleDelete(e, trip._id)} style={{ background: 'white', width: '30px', height: '30px', borderRadius: '50%', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
                  </div>
                  
                  {/* Card Body */}
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#1f2937' }}>{trip.destination}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.9rem' }}>
                      <span>📅</span>
                      <span>{new Date(trip.startDate).toLocaleDateString()} • 7 Days</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>© 2025 Capstone Project. Built with MERN Stack.</footer>
    </div>
  );
}

// --- App Shell (SAFE VERSION) ---
export default function App() {
  // CRASH PROOF STATE INITIALIZATION
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_data');
    try { return saved ? JSON.parse(saved) : null; } catch (e) { return null; }
  });

  const handleLogin = (googleUser) => {
    setUser(googleUser);
    localStorage.setItem('user_data', JSON.stringify(googleUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onSuccess={handleLogin} />} />
        <Route path="/trip/:id" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}