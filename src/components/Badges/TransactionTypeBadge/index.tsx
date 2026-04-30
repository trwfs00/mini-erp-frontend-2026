import { Badge } from "@mantine/core";
import type { TransactionType } from "@/types/stock/StockTransaction";
import type { FC } from "react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tStockList } from "@/consts/translations/tStockList";

type Props = {
  type: TransactionType;
};

export const TransactionTypeBadge: FC<Props> = ({ type }) => {
  const t = useTranslation();
  const getColor = () => {
    switch (type) {
      case "IN":
        return "green";
      case "OUT":
        return "red";
      case "ADJUST":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Badge color={getColor()} variant="light">
      {t(tStockList.typeBadge[type])}
    </Badge>
  );
};
