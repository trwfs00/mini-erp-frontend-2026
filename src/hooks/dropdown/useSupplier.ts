import { SupplierService } from "@/services/SupplierService";
import type { SupplierDropdown } from "@/types/supplier/SupplierDropdown";
import type { ComboboxData } from "@mantine/core";
import { useState } from "react";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<SupplierDropdown[]>([]);

  const callGetSupplierDropdown = async (): Promise<boolean> => {
    const response = await SupplierService.getSupplierForDropdown();

    if (!response.ok) {
      return false;
    }

    setSuppliers(response.data || []);
    return true;
  };

  const supplierOptions: ComboboxData = suppliers.map((item) => ({
    value: item.supplier_id,
    label: item.name,
  }));

  return {
    suppliers,
    supplierOptions,
    callGetSupplierDropdown,
  };
};
