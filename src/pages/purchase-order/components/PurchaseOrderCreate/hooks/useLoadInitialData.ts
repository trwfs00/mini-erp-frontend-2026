import { useEffect, useState } from "react";
import { NotificationUtil } from "@/utils/NotificationUtil";
import type { ProductList } from "@/types/product/ProductList";
import { FETCH_ALL_ARGS } from "@/consts/api/fetchAllArgs";
import type { ComboboxData } from "@mantine/core";
// TODO: ลบ useMockProductData เมื่อ integrate API จริง (เปลี่ยนเป็น ProductService.getProductList)
import { useMockProductData } from "@/pages/product/hooks/useMockProductData";
// TODO: เปลี่ยนเป็น useSuppliers เมื่อ integrate API จริง
import { useMockSupplierDropdown } from "@/hooks/dropdown/useMockSupplierDropdown";

export const useLoadInitialData = () => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [products, setProducts] = useState<ProductList[]>([]);

  // TODO: เปลี่ยนเป็น ProductService.getProductList เมื่อ integrate API จริง
  const { getMockProductList } = useMockProductData();

  // TODO: เปลี่ยนเป็น useSuppliers เมื่อ integrate API จริง
  const { supplierOptions, callGetSupplierDropdown } =
    useMockSupplierDropdown();

  const callGetProducts = async (): Promise<boolean> => {
    const response = await getMockProductList({
      ...FETCH_ALL_ARGS,
      criteria: {},
      sort_bys: [{ field: "name", direction: "asc" }],
    });
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
