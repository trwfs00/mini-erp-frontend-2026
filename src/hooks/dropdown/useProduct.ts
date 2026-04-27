import { ProductService } from "@/services/ProductService";
import type { ProductDropdown } from "@/types/product/ProductDropdown";
import type { ComboboxData } from "@mantine/core";
import { useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<ProductDropdown[]>([]);

  const callGetProductDropdown = async (): Promise<boolean> => {
    const response = await ProductService.getProductForDropdown();

    if (!response.ok) {
      return false;
    }

    setProducts(response.data || []);
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
