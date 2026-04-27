// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type { ComboboxData } from "@mantine/core";
import { useState } from "react";

type ProductDropdownItem = {
  product_id: string;
  sku: string;
  name: string;
};

const MOCK_PRODUCT_DROPDOWN: ProductDropdownItem[] = [
  { product_id: "prod1", sku: "BVG-001", name: "Coca-Cola 325ml" },
  { product_id: "prod2", sku: "BVG-002", name: "Pepsi 325ml" },
  { product_id: "prod3", sku: "SNK-001", name: "Lay's Original 50g" },
  { product_id: "prod4", sku: "DRY-001", name: "Fresh Milk 1L" },
  { product_id: "prod5", sku: "BKR-001", name: "Whole Wheat Bread" },
  { product_id: "prod6", sku: "FRZ-001", name: "Frozen Pizza Margherita" },
  { product_id: "prod7", sku: "PRD-001", name: "Banana 1kg" },
  { product_id: "prod8", sku: "CDM-001", name: "Soy Sauce 200ml" },
  { product_id: "prod9", sku: "BVG-003", name: "Sprite 325ml" },
  { product_id: "prod10", sku: "SNK-002", name: "Pringles Sour Cream 110g" },
  { product_id: "prod11", sku: "DRY-002", name: "Greek Yogurt 150g" },
  { product_id: "prod12", sku: "BKR-002", name: "Croissant" },
  { product_id: "prod13", sku: "FRZ-002", name: "Frozen Chicken Nuggets 500g" },
  { product_id: "prod14", sku: "PRD-002", name: "Apple Fuji 1kg" },
  { product_id: "prod15", sku: "CDM-002", name: "Tomato Ketchup 300g" },
];

export const useMockProductDropdown = () => {
  const [products, setProducts] = useState<ProductDropdownItem[]>([]);

  const callGetProductDropdown = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setProducts(MOCK_PRODUCT_DROPDOWN);
    return true;
  };

  const productOptions: ComboboxData = products.map((item) => ({
    value: item.product_id,
    label: `${item.sku} - ${item.name}`,
  }));

  return {
    products,
    productOptions,
    callGetProductDropdown,
  };
};
