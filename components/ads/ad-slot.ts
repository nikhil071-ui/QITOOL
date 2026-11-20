import { getAdSlotStatus, type AdSlotPlacement } from "../../lib/ad-slots";

type AdSlotProps = {
  route: string;
  placement: AdSlotPlacement;
};

/**
 * Server-only placement anchor. It deliberately emits no markup until a real
 * provider, publisher/slot configuration and advertising consent adapter are
 * selected and implemented. The feature switch alone cannot activate ads.
 */
export function AdSlot({ route, placement }: AdSlotProps): null {
  const status = getAdSlotStatus(route, placement);
  if (status !== "ready") return null;

  // Keep returning null until the owner approves and a real CMP/provider adapter
  // is implemented. Never replace this with a blank box or simulated ad.
  return null;
}
