import { useEffect, useState } from "react";
import { NotificationUtil } from "@/utils/NotificationUtil";
// TODO: เปลี่ยนเป็น useCategories เมื่อ integrate API จริง
import { useMockCategoryDropdown } from "@/hooks/dropdown/useMockCategoryDropdown";

type Params = {
  opened: boolean;
};

export const useLoadInitialData = ({ opened }: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

  // Dropdown hooks
  // TODO: เปลี่ยนเป็น useCategories เมื่อ integrate API จริง
  const { categoryOptions, callGetCategoryDropdown } = useMockCategoryDropdown();

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

  // โหลดเฉพาะตอน drawer เปิดครั้งแรก
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
