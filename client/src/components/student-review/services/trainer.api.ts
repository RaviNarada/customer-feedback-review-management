const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchTrainersWithStatus = async () => {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/student-review/trainers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch trainers');
  return json.data;
};