// Job Types
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote' | string;

// Auth Types
export type AuthUser = {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

// API Error Types
export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
}; 