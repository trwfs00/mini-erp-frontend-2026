import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { PurchaseOrderService } from "@/services/PurchaseOrderService";
import type { PurchaseOrder } from "@/types/purchase-order/PurchaseOrder";
import { NotificationUtil } from "@/utils/NotificationUtil";

type Params = {
  id?: string;
};

export const useLoadInitialData = ({ id }: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const callGetPurchaseOrder = async (): Promise<boolean> => {
    if (!id) return false;
    const response = await PurchaseOrderService.getPurchaseOrder(id);
    if (!response.ok) {
      setNotFound(true);
      return false;
    }
    setOrder(response.data);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const promises = [callGetPurchaseOrder()];
    const success = await Promise.all(promises);
    setIsLoadingInitialData(false);

    if (success.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "Failed to load purchase order",
      });
    }
  };

  const reloadOrder = async (): Promise<boolean> => {
    return await callGetPurchaseOrder();
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useDidUpdate(() => {
    loadInitialData();
  }, [id]);

  return {
    isLoadingInitialData,
    order,
    notFound,
    reloadOrder,
  };
};
