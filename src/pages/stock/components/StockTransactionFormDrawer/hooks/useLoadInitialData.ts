import { useEffect, useState } from "react";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { useProducts } from "@/hooks/dropdown/useProduct";
import { useStockSummary } from "@/pages/stock/hooks/useStockSummary";

type Params = {
  opened: boolean;
};

export const useLoadInitialData = ({ opened }: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

  const { productOptions, callGetProductDropdown } = useProducts();
  const { summary, fetchSummary, clearSummary } = useStockSummary();

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);

    const promises = [callGetProductDropdown()];
    const results = await Promise.all(promises);

    setIsLoadingInitialData(false);

    if (results.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  useEffect(() => {
    if (opened) {
      loadInitialData();
    } else {
      clearSummary();
    }
  }, [opened]);

  return {
    isLoadingInitialData,
    productOptions,
    summary,
    fetchSummary,
  };
};
