import { useEffect, useState } from "react";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { ProductService } from "@/services/ProductService";
import type { ProductList } from "@/types/product/ProductList";
import { FETCH_ALL_ARGS } from "@/consts/api/fetchAllArgs";
import type { ComboboxData } from "@mantine/core";
import { useSuppliers } from "@/hooks/dropdown/useSupplier";

export const useLoadInitialData = () => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [products, setProducts] = useState<ProductList[]>([]);

  const { supplierOptions, callGetSupplierDropdown } = useSuppliers();

  const callGetProducts = async (): Promise<boolean> => {
    const response = await ProductService.getProductList({
      ...FETCH_ALL_ARGS,
      criteria: {},
      sort_bys: [{ field: "name", direction: "asc" }],
    });
    if (!response.ok) return false;
    setProducts(response.data.data);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);

    const promises = [callGetProducts(), callGetSupplierDropdown()];
    const results = await Promise.all(promises);

    setIsLoadingInitialData(false);

    if (results.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const productOptions: ComboboxData = products.map((p) => ({
    value: p.product_id,
    label: `${p.sku} - ${p.name}`,
  }));

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    isLoadingInitialData,
    productOptions,
    products,
    supplierOptions,
  };
};
