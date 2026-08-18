import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';

// internal/service/redemption_service.go's RedeemResult has no JSON tags,
// same pattern as CreateCheckinResult — confirmed live against the deployed
// backend before writing this type.
export interface RedeemResult {
  RedemptionID: string;
  CodeOrSlot: string;
  NewBalance: number;
}

function redeem(redemptionItemId: string): Promise<RedeemResult> {
  return apiFetch<RedeemResult>('/api/redemptions', {
    method: 'POST',
    body: JSON.stringify({ redemption_item_id: redemptionItemId }),
  });
}

export function useRedeem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: redeem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}
