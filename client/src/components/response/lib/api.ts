// Lightweight types and mock API used by the response module.
// This keeps the new components self-contained while the real server
// API is not yet wired.

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

// In-memory mock dataset. This is intentionally simple and synchronous-ish
// so the UI can be exercised without a backend. Replace these with actual
// fetch calls when the server endpoints are available.
let MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 1,
    studentName: 'Alice Johnson',
    rating: 5,
    ratingLabel: 'Very Good',
    comment: 'Great trainer and clear explanations.',
    course: 'React Basics',
    date: '2026-02-20',
    status: 'replied',
    response: { adminName: 'Admin', message: 'Thanks Alice!', date: '2026-02-21' },
  },
  {
    id: 2,
    studentName: 'Bob Smith',
    rating: 3,
    ratingLabel: 'Neutral',
    comment: 'Content was okay, could use more examples.',
    course: 'TypeScript 101',
    date: '2026-02-22',
    status: 'pending',
  },
  {
    id: 3,
    studentName: 'Clara Lee',
    rating: 4,
    ratingLabel: 'Good',
    comment: 'Helpful trainer and good pace.',
    course: 'Advanced JS',
    date: '2026-02-25',
    status: 'pending',
  },
];

export async function fetchStats(): Promise<Stats> {
  const total = MOCK_FEEDBACKS.length;
  const replied = MOCK_FEEDBACKS.filter(f => f.status === 'replied').length;
  const pending = total - replied;
  const avgRating = Math.round((MOCK_FEEDBACKS.reduce((s, f) => s + f.rating, 0) / total) * 10) / 10;
  return { total, replied, pending, avgRating };
}

export async function fetchFeedbacks(filter: 'all' | 'replied' | 'pending' = 'all', search = ''): Promise<Feedback[]> {
  let items = MOCK_FEEDBACKS.slice();
  if (filter === 'replied') items = items.filter(i => i.status === 'replied');
  if (filter === 'pending') items = items.filter(i => i.status === 'pending');
  if (search.trim()) {
    const s = search.toLowerCase();
    items = items.filter(i =>
      i.studentName.toLowerCase().includes(s) ||
      i.course.toLowerCase().includes(s) ||
      i.comment.toLowerCase().includes(s)
    );
  }
  // Simulate small network delay
  await new Promise(r => setTimeout(r, 120));
  return items;
}

export async function submitResponse(id: number, message: string): Promise<void> {
  const idx = MOCK_FEEDBACKS.findIndex(f => f.id === id);
  if (idx === -1) throw new Error('Feedback not found');
  MOCK_FEEDBACKS[idx] = {
    ...MOCK_FEEDBACKS[idx],
    status: 'replied',
    response: { adminName: 'Admin', message, date: new Date().toISOString().slice(0, 10) },
  };
  // small delay
  await new Promise(r => setTimeout(r, 120));
}

export default {};
