import { useState } from "react";
import { StockService } from "@/services/StockService";
import type { StockSummary } from "@/types/stock/StockTransaction";

export const useStockSummary = () => {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = async (productId: string): Promise<void> => {
    setIsLoading(true);
    const response = await StockService.getStockSummary(productId);
    if (!response.ok) {
      setSummary(null);
      setIsLoading(false);
      return;
    }
    setSummary(response.data);
    setIsLoading(false);
  };

  const clearSummary = (): void => setSummary(null);

  return { summary, isLoading, fetchSummary, clearSummary };
};
