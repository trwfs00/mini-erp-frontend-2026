import { useState, useEffect } from "react";
import { ProductService } from "@/services/ProductService";

export const useProductOptions = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const response = await ProductService.getProductList({
        criteria: {},
        page: 1,
        limit: 100, // Fetch all for dropdown
        sort_bys: [{ field: "name", direction: "asc" }],
      });

      if (response.ok && response.data) {
        setOptions(
          response.data.data.map((p) => ({
            value: p.product_id,
            label: `${p.sku} - ${p.name}`,
          })),
        );
      } else {
        console.error("Failed to fetch product options", response.message);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return { options, isLoading };
};
