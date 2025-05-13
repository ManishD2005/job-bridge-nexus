import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { describe, expect, it, vi } from 'vitest';

describe('Button Component', () => {
  it('renders button with text', () => {
    // Arrange
    render(<Button>Click me</Button>);
    
    // Assert
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    // Act
    await userEvent.click(screen.getByRole('button', { name: /click me/i }));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 