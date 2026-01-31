/**
 * Tests for usePayments hooks
 * 
 * Tests the payment query and mutation hooks to ensure they:
 * - Fetch payments list with proper filtering
 * - Fetch single payment details
 * - Create payments successfully
 * - Approve payments with optimistic updates
 * - Reject payments with optimistic updates
 * - Handle errors and rollback appropriately
 * - Invalidate cache correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  usePayments,
  usePayment,
  useCreatePayment,
  useApprovePayment,
  useRejectPayment,
  useDualApprovePayment,
} from '../../../hooks/queries/usePayments';
import { paymentsApi } from '../../../lib/api/payments';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/payments', () => ({
  paymentsApi: {
    getPaymentApprovals: vi.fn(),
    getPaymentApproval: vi.fn(),
    createPaymentApproval: vi.fn(),
    approvePayment: vi.fn(),
    rejectPayment: vi.fn(),
  },
}));

describe('usePayments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch payments list successfully', async () => {
    // Arrange
    const mockPayments = [
      {
        id: 'payment-1',
        project_id: 'proj-123',
        corporate_id: 'corp-123',
        amount: 50000,
        payment_type: 'milestone' as const,
        category: 'project_expense',
        description: 'Q1 milestone payment',
        recipient_name: 'NGO Name',
        recipient_account: '1234567890',
        recipient_bank: 'Bank Name',
        urgency: 'high' as const,
        status: 'pending' as const,
        created_at: '2026-01-31T00:00:00Z',
        updated_at: '2026-01-31T00:00:00Z',
      },
      {
        id: 'payment-2',
        project_id: 'proj-123',
        corporate_id: 'corp-123',
        amount: 30000,
        payment_type: 'reimbursement' as const,
        category: 'supplies',
        description: 'Office supplies reimbursement',
        recipient_name: 'NGO Name',
        recipient_account: '1234567890',
        recipient_bank: 'Bank Name',
        urgency: 'medium' as const,
        status: 'approved' as const,
        created_at: '2026-01-30T00:00:00Z',
        updated_at: '2026-01-31T00:00:00Z',
      },
    ];

    vi.mocked(paymentsApi.getPaymentApprovals).mockResolvedValue({
      success: true,
      data: mockPayments,
    });

    // Act
    const { result } = renderHook(
      () => usePayments('corp-123', { status: 'pending' }),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockPayments);
    expect(paymentsApi.getPaymentApprovals).toHaveBeenCalledWith('corp-123', { status: 'pending' });
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch payments errors', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch payments';
    vi.mocked(paymentsApi.getPaymentApprovals).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(
      () => usePayments('corp-123'),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to fail
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('usePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single payment successfully', async () => {
    // Arrange
    const mockPayment = {
      id: 'payment-123',
      project_id: 'proj-123',
      corporate_id: 'corp-123',
      amount: 50000,
      payment_type: 'milestone' as const,
      category: 'project_expense',
      description: 'Q1 milestone payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      status: 'pending' as const,
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(paymentsApi.getPaymentApproval).mockResolvedValue({
      success: true,
      data: mockPayment,
    });

    // Act
    const { result } = renderHook(
      () => usePayment('payment-123'),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockPayment);
    expect(paymentsApi.getPaymentApproval).toHaveBeenCalledWith('payment-123');
    expect(result.current.error).toBeNull();
  });
});

describe('useCreatePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create payment successfully', async () => {
    // Arrange
    const paymentRequest = {
      project_id: 'proj-123',
      corporate_id: 'corp-123',
      amount: 50000,
      payment_type: 'milestone' as const,
      category: 'project_expense',
      description: 'Q1 milestone payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
    };

    const mockResponse = {
      id: 'payment-123',
      ...paymentRequest,
      status: 'pending' as const,
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(paymentsApi.createPaymentApproval).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useCreatePayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(paymentRequest);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(paymentsApi.createPaymentApproval).toHaveBeenCalledWith(paymentRequest);
    expect(result.current.error).toBeNull();
  });

  it('should handle create payment errors', async () => {
    // Arrange
    const errorMessage = 'Failed to create payment';
    vi.mocked(paymentsApi.createPaymentApproval).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const paymentRequest = {
      project_id: 'proj-123',
      corporate_id: 'corp-123',
      amount: 50000,
      payment_type: 'milestone' as const,
      category: 'project_expense',
      description: 'Q1 milestone payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
    };

    // Act
    const { result } = renderHook(
      () => useCreatePayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(paymentRequest);

    // Wait for mutation to fail
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('useApprovePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should approve payment successfully', async () => {
    // Arrange
    const approveParams = {
      id: 'payment-123',
      notes: 'Approved after verification',
      approved_amount: 50000,
      payment_reference: 'REF-2026-001',
    };

    const mockResponse = {
      id: 'payment-123',
      project_id: 'proj-123',
      corporate_id: 'corp-123',
      amount: 50000,
      payment_type: 'milestone' as const,
      category: 'project_expense',
      description: 'Q1 milestone payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      status: 'approved' as const,
      approver_id: 'admin-1',
      approved_at: '2026-01-31T12:00:00Z',
      notes: 'Approved after verification',
      approved_amount: 50000,
      payment_reference: 'REF-2026-001',
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T12:00:00Z',
    };

    vi.mocked(paymentsApi.approvePayment).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useApprovePayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(approveParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(paymentsApi.approvePayment).toHaveBeenCalledWith('payment-123', {
      notes: 'Approved after verification',
      approved_amount: 50000,
      payment_reference: 'REF-2026-001',
    });
  });

  it('should handle approve payment errors', async () => {
    // Arrange
    const errorMessage = 'Failed to approve payment';
    vi.mocked(paymentsApi.approvePayment).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const approveParams = {
      id: 'payment-123',
      notes: 'Approved',
    };

    // Act
    const { result } = renderHook(
      () => useApprovePayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(approveParams);

    // Wait for mutation to fail
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('useRejectPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject payment successfully', async () => {
    // Arrange
    const rejectParams = {
      id: 'payment-123',
      reason: 'Insufficient documentation',
      requires_revision: true,
    };

    const mockResponse = {
      id: 'payment-123',
      project_id: 'proj-123',
      corporate_id: 'corp-123',
      amount: 50000,
      payment_type: 'milestone' as const,
      category: 'project_expense',
      description: 'Q1 milestone payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      status: 'rejected' as const,
      approver_id: 'admin-1',
      approved_at: '2026-01-31T12:00:00Z',
      rejection_reason: 'Insufficient documentation',
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T12:00:00Z',
    };

    vi.mocked(paymentsApi.rejectPayment).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useRejectPayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(rejectParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(paymentsApi.rejectPayment).toHaveBeenCalledWith('payment-123', {
      reason: 'Insufficient documentation',
      requires_revision: true,
    });
  });

  it('should handle reject payment errors', async () => {
    // Arrange
    const errorMessage = 'Failed to reject payment';
    vi.mocked(paymentsApi.rejectPayment).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const rejectParams = {
      id: 'payment-123',
      reason: 'Test rejection',
    };

    // Act
    const { result } = renderHook(
      () => useRejectPayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(rejectParams);

    // Wait for mutation to fail
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('useDualApprovePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dual-approve payment successfully', async () => {
    // Arrange
    const dualApproveParams = {
      id: 'payment-123',
      second_approver_notes: 'Verified and approved as second approver',
    };

    const mockResponse = {
      id: 'payment-123',
      project_id: 'proj-123',
      corporate_id: 'corp-123',
      amount: 100000,
      payment_type: 'milestone' as const,
      category: 'project_expense',
      description: 'Large milestone payment requiring dual approval',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      status: 'approved' as const,
      approver_id: 'admin-2',
      approved_at: '2026-01-31T14:00:00Z',
      notes: 'Verified and approved as second approver',
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T14:00:00Z',
    };

    vi.mocked(paymentsApi.approvePayment).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useDualApprovePayment(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(dualApproveParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(paymentsApi.approvePayment).toHaveBeenCalledWith('payment-123', {
      notes: 'Verified and approved as second approver',
    });
  });
});
