import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import { PurchaseOrderService } from "@/services/PurchaseOrderService";
import type {
  PurchaseOrderStatus,
  PurchaseOrderSummary,
} from "@/types/purchase-order/PurchaseOrder";
import type { OrderBy } from "@/types/SortOrder";
import { NotificationUtil } from "@/utils/NotificationUtil";

type Params = {
  page: number;
  limit: number;
  search: string;
  statusFilter: PurchaseOrderStatus | "ALL";
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
  statusFilter,
  sortBy,
  orderBy,
  setTotalPage,
  setTotalCount,
  setPage,
}: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([]);

  const callGetPurchaseOrderList = async (): Promise<boolean> => {
    setOrders([]);
    const response = await PurchaseOrderService.getPurchaseOrderList({
      criteria: {
        search: search || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      },
      page,
      limit,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    if (!response.ok) return false;

    setOrders(response.data.data);
    setTotalPage(response.data.pagination.total_page);
    setTotalCount(response.data.pagination.total_count);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const promises = [callGetPurchaseOrderList()];
    const success = await Promise.all(promises);
    setIsLoadingInitialData(false);

    if (success.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadOrders = async (): Promise<boolean> => {
    setIsReloading(true);
    const success = await callGetPurchaseOrderList();
    setIsReloading(false);

    if (!success) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
    return success;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useDidUpdate(() => {
    reloadOrders();
  }, [page, limit, sortBy, orderBy]);

  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadOrders();
    }
  }, [search, statusFilter]);

  return {
    isLoadingInitialData,
    isReloading,
    orders,
    reloadOrders,
  };
};
