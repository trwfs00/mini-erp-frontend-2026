import { useState, useCallback } from "react";
import { StockService } from "@/services/StockService";
import type { StockSummary } from "@/types/stock/StockTransaction";

export const useStockSummary = () => {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = useCallback(async (productId: string) => {
    setIsLoading(true);
    const response = await StockService.getStockSummary(productId);
    if (response.ok && response.data) {
      setSummary(response.data);
    } else {
      console.error("Failed to fetch stock summary", response.message);
    }
    setIsLoading(false);
  }, []);

  return { summary, isLoading, fetchSummary };
};
