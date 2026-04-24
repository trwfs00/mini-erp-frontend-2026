import { useEffect } from "react";
import {
  Drawer,
  Button,
  TextInput,
  NumberInput,
  Stack,
  Group,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { productSchema, type ProductFormValues } from "@/schemas/productSchema";
import type { ProductList } from "@/types/product/ProductList";
import { useCategoryOptions } from "@/hooks/category/useCategoryOptions";

type Props = {
  opened: boolean;
  onClose: () => void;
  product?: ProductList | null;
  onSave: (values: ProductFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const ProductFormDrawer = ({
  opened,
  onClose,
  product,
  onSave,
  isLoading = false,
}: Props) => {
  const isEditing = !!product;
  const { options: categoryOptions, isLoading: isLoadingCategories } =
    useCategoryOptions();

  const form = useForm<ProductFormValues>({
    validate: yupResolver(productSchema),
    initialValues: {
      sku: "",
      name: "",
      category_id: "",
      cost_price: 0,
      selling_price: 0,
      unit: "",
      min_stock: 0,
    },
  });

  useEffect(() => {
    if (opened) {
      if (product) {
        form.setValues({
          sku: product.sku,
          name: product.name,
          category_id: product.category_id,
          cost_price: product.cost_price,
          selling_price: product.selling_price,
          unit: product.unit,
          min_stock: product.min_stock,
        });
      } else {
        form.reset();
      }
    }
  }, [opened, product]);

  const handleSubmit = async (values: ProductFormValues) => {
    await onSave(values);
    form.reset();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={isEditing ? "Edit Product" : "Add New Product"}
      styles={{
        title: {
          fontWeight: 600,
          fontSize: 18,
        },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="SKU"
            placeholder="Enter product SKU"
            withAsterisk
            disabled={isEditing}
            {...form.getInputProps("sku")}
          />

          <TextInput
            label="Product Name"
            placeholder="Enter product name"
            withAsterisk
            {...form.getInputProps("name")}
          />

          <Select
            label="Category"
            placeholder={
              isLoadingCategories ? "Loading..." : "Select a category"
            }
            withAsterisk
            data={categoryOptions}
            disabled={isLoadingCategories}
            {...form.getInputProps("category_id")}
          />

          <Group grow>
            <NumberInput
              label="Cost Price"
              placeholder="0.00"
              min={0}
              decimalScale={2}
              withAsterisk
              {...form.getInputProps("cost_price")}
            />
            <NumberInput
              label="Selling Price"
              placeholder="0.00"
              min={0}
              decimalScale={2}
              withAsterisk
              {...form.getInputProps("selling_price")}
            />
          </Group>

          <Group grow>
            <TextInput
              label="Unit"
              placeholder="e.g. piece, box"
              withAsterisk
              {...form.getInputProps("unit")}
            />
            <NumberInput
              label="Min Stock"
              placeholder="0"
              min={0}
              withAsterisk
              {...form.getInputProps("min_stock")}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
