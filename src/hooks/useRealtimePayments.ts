import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { PaymentApproval } from '../lib/api/corporates';

export function useRealtimePaymentApprovals(
  corporateId: string | null,
  initialApprovals: PaymentApproval[] = []
) {
  const [approvals, setApprovals] = useState<PaymentApproval[]>(initialApprovals);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setApprovals(initialApprovals);
    setPendingCount(
      initialApprovals.filter((a) => a.status === 'pending').length
    );
  }, [initialApprovals]);

  const { isConnected } = useRealtimeSubscription<PaymentApproval>(
    {
      table: 'payment_approvals',
    },
    {
      onInsert: (newApproval) => {
        setApprovals((prev) => [newApproval, ...prev]);
        if (newApproval.status === 'pending') {
          setPendingCount((prev) => prev + 1);
        }
      },
      onUpdate: (updatedApproval) => {
        setApprovals((prev) => {
          const oldApproval = prev.find((a) => a.id === updatedApproval.id);
          const wasPending = oldApproval?.status === 'pending';
          const isPending = updatedApproval.status === 'pending';

          if (wasPending && !isPending) {
            setPendingCount((count) => Math.max(0, count - 1));
          } else if (!wasPending && isPending) {
            setPendingCount((count) => count + 1);
          }

          return prev.map((a) =>
            a.id === updatedApproval.id ? updatedApproval : a
          );
        });
      },
      onDelete: (deletedApproval) => {
        if (deletedApproval.status === 'pending') {
          setPendingCount((prev) => Math.max(0, prev - 1));
        }
        setApprovals((prev) => prev.filter((a) => a.id !== deletedApproval.id));
      },
    },
    !!corporateId
  );

  return { approvals, pendingCount, isConnected };
}