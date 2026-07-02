import type { AssetId } from "../../types/ids";

export const assetRegistry: Record<AssetId, string> = {};

export function getAssetPath(assetId: AssetId): string | undefined {
  return assetRegistry[assetId];
}
