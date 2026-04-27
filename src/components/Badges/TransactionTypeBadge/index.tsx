import { Badge } from "@mantine/core";
import type { TransactionType } from "@/types/stock/StockTransaction";
import type { FC } from "react";

type Props = {
  type: TransactionType;
};

export const TransactionTypeBadge: FC<Props> = ({ type }) => {
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
      {type}
    </Badge>
  );
};
