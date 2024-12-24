import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VariantForm } from '@/components/inventory/variant-form/variant-form';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('VariantForm', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should call onClose when provided and cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<VariantForm onClose={onClose} />);

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should navigate back to inventory when no onClose provided and cancel button is clicked', () => {
    render(<VariantForm />);

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/inventory');
  });

  it('should reset form state when cancel button is clicked', async () => {
    render(<VariantForm />);

    // Fill in a form field
    const nameInput = screen.getByPlaceholderText('Enter product name');
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });

    // Click cancel
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    // Verify form is reset
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
    });
  });

  it('should disable submit button while submitting', async () => {
    render(<VariantForm />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});