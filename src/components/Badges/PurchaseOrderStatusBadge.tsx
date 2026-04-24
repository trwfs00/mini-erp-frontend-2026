import { Badge } from "@mantine/core";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import type { FC } from "react";
import { PO_STATUS_LABELS } from "@/consts/poStatusLabels";

type Props = {
  status: PurchaseOrderStatus;
};

export const PurchaseOrderStatusBadge: FC<Props> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "DRAFT":
        return "gray";
      case "CONFIRMED":
        return "blue";
      case "RECEIVED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Badge color={getColor()} variant="light">
      {PO_STATUS_LABELS[status]}
    </Badge>
  );
};
