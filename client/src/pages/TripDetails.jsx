import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Reorder, AnimatePresence } from 'framer-motion'; // Import Reorder
import { getTrip, updateTrip } from '../services/api';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [newActivity, setNewActivity] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch Trip
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTrip(id);
        if (!data.activities) data.activities = [];
        setTrip(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch trip", err);
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  // 2. Handle Reorder (Drag & Drop Logic)
  const handleReorder = (newOrder) => {
    // Update UI immediately (Smooth animation)
    const updatedTrip = { ...trip, activities: newOrder };
    setTrip(updatedTrip);
    
    // Save new order to Database
    updateTrip(id, updatedTrip); 
  };

  // 3. Add Activity
  const handleAddActivity = async () => {
    if (!newActivity) return;
    const newItem = { text: newActivity, id: Date.now() }; // Unique ID is crucial
    const updatedTrip = { ...trip, activities: [...trip.activities, newItem] };
    
    setTrip(updatedTrip);
    setNewActivity('');
    await updateTrip(id, updatedTrip);
  };

  // 4. Delete Activity
  const handleDeleteActivity = async (activityId) => {
    const updatedTrip = { 
      ...trip, 
      activities: trip.activities.filter(a => a.id !== activityId) 
    };
    setTrip(updatedTrip);
    await updateTrip(id, updatedTrip);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!trip) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Trip not found!</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#6366f1', fontWeight: '800', fontSize: '1.5rem' }}>PlanYourTrip</h2>
        <Link to="/" style={{ textDecoration: 'none', color: '#6b7280' }}>← Back to Dashboard</Link>
      </div>

      {/* Main Card */}
      <div style={{ background: 'white', maxWidth: '800px', margin: '0 auto', borderRadius: '24px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', color: '#1f2937' }}>{trip.destination}</h1>
        <p style={{ color: '#6366f1', marginBottom: '2rem', fontWeight: '500' }}>
          ✨ Drag and drop items to reorder your itinerary!
        </p>

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="What do you want to do? (e.g. Visit Museum)" 
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
          />
          <button 
            onClick={handleAddActivity}
            style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            Add
          </button>
        </div>

        {/* DRAG AND DROP LIST */}
        <Reorder.Group axis="y" values={trip.activities} onReorder={handleReorder} style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <AnimatePresence>
            {trip.activities.map((activity) => (
              <Reorder.Item 
                key={activity.id} 
                value={activity}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                whileDrag={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)", cursor: 'grabbing' }}
                style={{ background: 'white', border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>☰</span> {/* Drag Handle Icon */}
                  <span style={{ fontWeight: '500', color: '#374151' }}>{activity.text}</span>
                </div>
                <button 
                  onClick={() => handleDeleteActivity(activity.id)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.5rem' }}
                >
                  ×
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {(!trip.activities || trip.activities.length === 0) && (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', border: '2px dashed #e5e7eb', borderRadius: '16px' }}>
            No activities yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
}