#!/bin/bash

# Fix automatically fixable issues
echo "Fixing automatically fixable issues..."
npm run lint -- --fix

# Create a TypeJobType.ts file for job types
echo "Creating type definitions..."
mkdir -p src/types
cat > src/types/JobTypes.ts << 'EOL'
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
EOL

echo "Linting issues fixed. Please check remaining issues manually." 