import { useEffect, useState } from "react";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { useCategories } from "@/hooks/dropdown/useCategory";

type Params = {
  opened: boolean;
};

export const useLoadInitialData = ({ opened }: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

  const { categoryOptions, callGetCategoryDropdown } = useCategories();

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);

    const promises = [callGetCategoryDropdown()];
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
    }
  }, [opened]);

  return {
    isLoadingInitialData,
    categoryOptions,
  };
};
