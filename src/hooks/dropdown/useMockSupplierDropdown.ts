// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import type { SupplierDropdown } from "@/types/supplier/SupplierDropdown";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type { ComboboxData } from "@mantine/core";
import { useState } from "react";

const MOCK_SUPPLIER_DROPDOWN: SupplierDropdown[] = [
  { supplier_id: "sup1", name: "Bangkok Beverages Co., Ltd." },
  { supplier_id: "sup2", name: "Thai Snack Distributors" },
  { supplier_id: "sup3", name: "Fresh Dairy Supply" },
  { supplier_id: "sup4", name: "Golden Bakery Wholesale" },
  { supplier_id: "sup5", name: "Frozen Foods Asia" },
  { supplier_id: "sup6", name: "Country Produce Cooperative" },
  { supplier_id: "sup7", name: "Premium Condiments Trading" },
  { supplier_id: "sup8", name: "Eastern Logistics Partner" },
  { supplier_id: "sup9", name: "North Highlands Coffee" },
  { supplier_id: "sup10", name: "Sunshine Fruits Import" },
];

export const useMockSupplierDropdown = () => {
  const [suppliers, setSuppliers] = useState<SupplierDropdown[]>([]);

  const callGetSupplierDropdown = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setSuppliers(MOCK_SUPPLIER_DROPDOWN);
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
