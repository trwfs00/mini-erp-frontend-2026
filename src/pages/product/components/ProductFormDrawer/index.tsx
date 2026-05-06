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
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";
import { tProductList } from "@/consts/translations/tProductList";

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
  const t = useTranslation();
  const isEditing = !!product;
  const { categoryOptions } = useLoadInitialData({ opened });

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
      title={
        isEditing
          ? t(tProductList.form.editTitle)
          : t(tProductList.form.addTitle)
      }
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
            label={t(tProductList.form.skuLabel)}
            placeholder={t(tProductList.form.skuPlaceholder)}
            withAsterisk
            disabled={isEditing}
            {...form.getInputProps("sku")}
          />

          <TextInput
            label={t(tProductList.form.nameLabel)}
            placeholder={t(tProductList.form.namePlaceholder)}
            withAsterisk
            {...form.getInputProps("name")}
          />

          <Select
            label={t(tProductList.form.categoryLabel)}
            placeholder={t(tProductList.form.categoryPlaceholder)}
            withAsterisk
            data={categoryOptions}
            {...form.getInputProps("category_id")}
          />

          <Group grow>
            <NumberInput
              label={t(tProductList.form.costLabel)}
              placeholder="0.00"
              min={0}
              decimalScale={2}
              withAsterisk
              {...form.getInputProps("cost_price")}
            />
            <NumberInput
              label={t(tProductList.form.sellingLabel)}
              placeholder="0.00"
              min={0}
              decimalScale={2}
              withAsterisk
              {...form.getInputProps("selling_price")}
            />
          </Group>

          <Group grow>
            <TextInput
              label={t(tProductList.form.unitLabel)}
              placeholder={t(tProductList.form.unitPlaceholder)}
              withAsterisk
              {...form.getInputProps("unit")}
            />
            <NumberInput
              label={t(tProductList.form.minStockLabel)}
              placeholder="0"
              min={0}
              withAsterisk
              {...form.getInputProps("min_stock")}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              {t(tBasic.textCancel)}
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing
                ? t(tProductList.form.submitEdit)
                : t(tProductList.form.submitCreate)}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
