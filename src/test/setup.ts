import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// This file will be run before each test file 