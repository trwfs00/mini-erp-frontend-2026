import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import { NotificationUtil } from "@/utils/NotificationUtil";
import type { CategoryList } from "@/types/category/CategoryList";
import type { OrderBy } from "@/types/SortOrder";
// TODO: ลบ useMockCategoryData เมื่อ integrate API จริง
import { useMockCategoryData } from "./useMockCategoryData";

type Params = {
  page: number;
  limit: number;
  search: string;
  sortBy: string | null;
  orderBy: OrderBy;
  setTotalPage: (total: number) => void;
  setTotalCount: (count: number) => void;
  setPage: (page: number) => void;
};

export const useLoadInitialData = ({
  page,
  limit,
  search,
  sortBy,
  orderBy,
  setTotalPage,
  setTotalCount,
  setPage,
}: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [categories, setCategories] = useState<CategoryList[]>([]);

  // TODO: ลบ useMockCategoryData เมื่อ integrate API จริง
  const { getMockCategoryList } = useMockCategoryData();

  const callGetCategoryList = async (): Promise<boolean> => {
    setCategories([]);
    // TODO: เปลี่ยนเป็น CategoryService.getCategoryList เมื่อ integrate API จริง
    const response = await getMockCategoryList({
      page,
      limit,
      criteria: {
        search: search || undefined,
      },
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    setCategories(response.data.data);
    setTotalPage(response.data.pagination.total_page);
    setTotalCount(response.data.pagination.total_count);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const promises = [callGetCategoryList()];
    const success = await Promise.all(promises);
    setIsLoadingInitialData(false);

    if (success.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadCategoryList = async (): Promise<boolean> => {
    setIsReloading(true);
    const success = await callGetCategoryList();
    setIsReloading(false);

    if (!success) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
    return success;
  };

  // CRITICAL: Run once on mount only
  useEffect(() => {
    loadInitialData();
  }, []);

  // CRITICAL: Run when page, limit, sortBy, or orderBy changes
  useDidUpdate(() => {
    reloadCategoryList();
  }, [page, limit, sortBy, orderBy]);

  // เฝ้า search แยก เพราะต้องการ handle กรณีย้อนกลับมาหน้า 1
  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadCategoryList();
    }
  }, [search]);

  return {
    isLoadingInitialData,
    isReloading,
    categories,
    reloadCategoryList,
  };
};
