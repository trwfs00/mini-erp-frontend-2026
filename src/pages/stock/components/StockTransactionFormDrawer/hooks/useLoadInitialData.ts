import { useEffect, useState } from "react";
import { NotificationUtil } from "@/utils/NotificationUtil";
// TODO: เปลี่ยนเป็น dropdown hook จริงเมื่อ integrate API
import { useMockProductDropdown } from "@/hooks/dropdown/useMockProductDropdown";
import { useStockSummary } from "@/pages/stock/hooks/useStockSummary";

type Params = {
  opened: boolean;
};

export const useLoadInitialData = ({ opened }: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

  // TODO: เปลี่ยนเป็น dropdown hook จริงเมื่อ integrate API
  const { productOptions, callGetProductDropdown } = useMockProductDropdown();
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

  // โหลดเฉพาะตอน drawer เปิด
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
