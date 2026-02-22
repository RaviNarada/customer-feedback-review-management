export interface Trainer {
    id: number;
    name: string;
    course: string;
    rating: number;
    avatar: string;
    students: number;
    experience: string;
    bio: string;
}

export type Course = string | "All";