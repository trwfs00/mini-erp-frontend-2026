import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "@/services/PurchaseOrderService";
import type { PurchaseOrderSummary, PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import { useTableSort } from "@/hooks/table/useTableSort";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";

export const useLoadPurchaseOrderData = (search: string = "", statusFilter?: PurchaseOrderStatus) => {
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort("created_at", "desc");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const response = await PurchaseOrderService.getPurchaseOrderList({
      page: pagination.page,
      limit: pagination.limit,
      criteria: {
        search,
        status: statusFilter,
      },
      sort_bys: sortHandler.sortBy && sortHandler.orderBy ? [
        { field: sortHandler.sortBy, direction: sortHandler.orderBy === "asc" ? "asc" : "desc" }
      ] : undefined,
    });

    if (response.ok && response.data) {
      setOrders(response.data.data);
      pagination.setTotalCount(response.data.pagination.total_count);
      pagination.setTotalPage(response.data.pagination.total_page);
    }
    setIsLoading(false);
  }, [pagination.page, pagination.limit, search, statusFilter, sortHandler.sortBy, sortHandler.orderBy]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    pagination,
    sortHandler,
    reloadOrders: fetchOrders,
    isLoading,
  };
};
