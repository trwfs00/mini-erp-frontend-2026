// TODO: เปลี่ยนเป็น StockService.getStockSummary เมื่อ integrate API จริง

import { useState } from "react";
import type { StockSummary } from "@/types/stock/StockTransaction";
import { useMockStockData } from "./useMockStockData";

export const useStockSummary = () => {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: ลบ useMockStockData เมื่อ integrate API จริง
  const { getMockStockSummary } = useMockStockData();

  const fetchSummary = async (productId: string): Promise<void> => {
    setIsLoading(true);
    const response = await getMockStockSummary(productId);
    setSummary(response.data);
    setIsLoading(false);
  };

  const clearSummary = (): void => setSummary(null);

  return { summary, isLoading, fetchSummary, clearSummary };
};
