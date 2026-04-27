import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import type { SupplierList } from "@/types/supplier/SupplierList";
import type { OrderBy } from "@/types/SortOrder";
import { NotificationUtil } from "@/utils/NotificationUtil";
// TODO: ลบ useMockSupplierData เมื่อ integrate API จริง
import { useMockSupplierData } from "./useMockSupplierData";

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
  const [suppliers, setSuppliers] = useState<SupplierList[]>([]);

  // TODO: ลบ useMockSupplierData เมื่อ integrate API จริง
  const { getMockSupplierList } = useMockSupplierData();

  const callGetSupplierList = async (): Promise<boolean> => {
    setSuppliers([]);
    // TODO: เปลี่ยนเป็น SupplierService.getSupplierList เมื่อ integrate API จริง
    const response = await getMockSupplierList({
      criteria: { search: search || undefined },
      page,
      limit,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    setSuppliers(response.data.data);
    setTotalPage(response.data.pagination.total_page);
    setTotalCount(response.data.pagination.total_count);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const promises = [callGetSupplierList()];
    const results = await Promise.all(promises);
    setIsLoadingInitialData(false);

    if (results.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadSupplierList = async (): Promise<boolean> => {
    setIsReloading(true);
    const success = await callGetSupplierList();
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
    reloadSupplierList();
  }, [page, limit, sortBy, orderBy]);

  // เฝ้า search แยก เพราะต้องการ handle กรณีย้อนกลับมาหน้า 1
  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadSupplierList();
    }
  }, [search]);

  return {
    isLoadingInitialData,
    isReloading,
    suppliers,
    reloadSupplierList,
  };
};
