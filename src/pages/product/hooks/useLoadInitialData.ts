import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import type { ProductList } from "@/types/product/ProductList";
import type { OrderBy } from "@/types/SortOrder";
import { NotificationUtil } from "@/utils/NotificationUtil";
// TODO: ลบ useMockProductData เมื่อ integrate API จริง
import { useMockProductData } from "./useMockProductData";

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
  const [products, setProducts] = useState<ProductList[]>([]);

  // TODO: ลบ useMockProductData เมื่อ integrate API จริง
  const { getMockProductList } = useMockProductData();

  const callGetProductList = async (): Promise<boolean> => {
    setProducts([]);
    // TODO: เปลี่ยนเป็น ProductService.getProductList เมื่อ integrate API จริง
    const response = await getMockProductList({
      criteria: { search: search || undefined },
      page,
      limit,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    setProducts(response.data.data);
    setTotalPage(response.data.pagination.total_page);
    setTotalCount(response.data.pagination.total_count);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const success = await callGetProductList();
    setIsLoadingInitialData(false);

    if (!success) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadProductList = async (): Promise<boolean> => {
    setIsReloading(true);
    const success = await callGetProductList();
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
    reloadProductList();
  }, [page, limit, sortBy, orderBy]);

  // เฝ้า search แยก เพราะต้องการ handle กรณีย้อนกลับมาหน้า 1
  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadProductList();
    }
  }, [search]);

  return {
    isLoadingInitialData,
    isReloading,
    products,
    reloadProductList,
  };
};
