import { Badge } from "@mantine/core";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import type { FC } from "react";
import { PO_STATUS_LABELS } from "@/consts/poStatusLabels";
import { useTranslation } from "@/hooks/translation/useTranslation";

type Props = {
  status: PurchaseOrderStatus;
};

export const PurchaseOrderStatusBadge: FC<Props> = ({ status }) => {
  const t = useTranslation();
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
      {t(PO_STATUS_LABELS[status])}
    </Badge>
  );
};
