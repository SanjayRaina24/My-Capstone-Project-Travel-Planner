const API_URL = '/api/trips'; 
// The proxy will automatically turn this into http://localhost:5000/api/trips
export const getTrips = async (userId) => {
  const response = await fetch(`${API_URL}?userId=${userId}`);
  return response.json();
};

// --- MAKE SURE THIS IS HERE ---
export const getTrip = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
// -----------------------------

export const createTrip = async (trip) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip),
  });
  return response.json();
};

export const deleteTrip = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};

export const updateTrip = async (id, tripData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  return response.json();
};