import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import type { TransactionType } from "@/types/stock/StockTransaction";

export type StockFilterFormValues = {
  type: TransactionType | null;
  product_id: string | null;
};

export type StockFilterState = {
  type: TransactionType | null;
  product_id: string | null;
};

const INITIAL_VALUES: StockFilterFormValues = {
  type: null,
  product_id: null,
};

export const useStockFilter = () => {
  const form = useForm<StockFilterFormValues>({
    initialValues: INITIAL_VALUES,
  });

  const [filterState, setFilterState] =
    useState<StockFilterState>(INITIAL_VALUES);

  // Auto-sync form → filterState (no explicit Apply button)
  useEffect(() => {
    setFilterState({
      type: form.values.type,
      product_id: form.values.product_id,
    });
  }, [form.values.type, form.values.product_id]);

  const handleApplyFilter = (): void => {
    setFilterState({
      type: form.values.type,
      product_id: form.values.product_id,
    });
  };

  const handleResetFilter = (): void => {
    form.setValues(INITIAL_VALUES);
    setFilterState(INITIAL_VALUES);
  };

  const handleRemoveFilter = (key: keyof StockFilterState): void => {
    form.setFieldValue(key, null);
    setFilterState((prev) => ({ ...prev, [key]: null }));
  };

  const getFilterCount = (): number => {
    let count = 0;
    if (filterState.type !== null) count++;
    if (filterState.product_id !== null) count++;
    return count;
  };

  return {
    form,
    filterState,
    handleApplyFilter,
    handleResetFilter,
    handleRemoveFilter,
    filterCount: getFilterCount(),
  };
};
