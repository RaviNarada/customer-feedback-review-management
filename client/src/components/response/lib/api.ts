// API client for the response module.
// Connects to the backend server for feedback and response management.

const API_BASE_URL = 'http://localhost:3001/api';

export type Response = {
  adminName: string;
  message: string;
  date: string;
};

export type Feedback = {
  id: number;
  studentName: string;
  rating: number;
  ratingLabel: string;
  comment: string;
  course: string;
  date: string;
  status: 'replied' | 'pending';
  response?: Response | null;
};

export type Stats = {
  total: number;
  replied: number;
  pending: number;
  avgRating: number;
};

// Helper function for API calls
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText); // Debug log
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    
    return result.data as T;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export async function fetchStats(): Promise<Stats> {
  return await apiCall<Stats>('/feedback/stats');
}

export async function fetchFeedbacks(filter: 'all' | 'replied' | 'pending' = 'all', search = ''): Promise<Feedback[]> {
  const params = new URLSearchParams();
  if (filter !== 'all') params.append('filter', filter);
  if (search.trim()) params.append('search', search);
  
  const queryString = params.toString();
  const url = `/feedback${queryString ? `?${queryString}` : ''}`;
  
  return await apiCall<Feedback[]>(url);
}

export async function submitResponse(id: number, message: string): Promise<void> {
  await apiCall<void>(`/response/feedback/${id}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export default {};
