const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const submitFeedback = async (data: any) => {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/student-review/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to submit');
  return json.data;
};

export const fetchFeedbackByCourse = async (courseId: string) => {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/student-review/feedback/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Not found');
  return json.data;
};
