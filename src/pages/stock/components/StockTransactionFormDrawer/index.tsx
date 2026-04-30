import type { FC } from "react";
import { useEffect } from "react";
import {
  Drawer,
  Stack,
  TextInput,
  Button,
  Group,
  Select,
  NumberInput,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import {
  stockTransactionSchema,
  type StockTransactionFormValues,
} from "@/schemas/stockSchema";
import { AlertCircle } from "lucide-react";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";
import { tStockList } from "@/consts/translations/tStockList";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSave: (values: StockTransactionFormValues) => Promise<void>;
  isLoading: boolean;
};

export const StockTransactionFormDrawer: FC<Props> = ({
  opened,
  onClose,
  onSave,
  isLoading,
}) => {
  const t = useTranslation();
  const { productOptions, summary, fetchSummary } = useLoadInitialData({
    opened,
  });

  const form = useForm<StockTransactionFormValues>({
    initialValues: {
      product_id: "",
      type: "IN",
      quantity: 1,
      note: "",
      reason: "",
    },
    validate: yupResolver(stockTransactionSchema),
  });

  useEffect(() => {
    if (opened) {
      form.reset();
    }
  }, [opened]);

  useEffect(() => {
    if (form.values.product_id) {
      fetchSummary(form.values.product_id);
    }
  }, [form.values.product_id]);

  const handleSubmit = async (values: StockTransactionFormValues) => {
    if (values.type === "OUT" && summary) {
      if (values.quantity > summary.current_stock) {
        form.setFieldError(
          "quantity",
          t(tStockList.form.insufficientStock(summary.current_stock)),
        );
        return;
      }
    }
    await onSave(values);
  };

  const selectedType = form.values.type;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={t(tStockList.form.title)}
      position="right"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label={t(tStockList.form.productLabel)}
            placeholder={t(tStockList.form.productPlaceholder)}
            data={productOptions}
            searchable
            {...form.getInputProps("product_id")}
          />

          {summary && (
            <Alert
              icon={<AlertCircle size={16} />}
              title={t(tStockList.form.inventoryStatus)}
              color={summary.is_low_stock ? "orange" : "blue"}
              variant="light"
            >
              {t(tStockList.form.currentStock)}:{" "}
              <strong>{summary.current_stock}</strong>
              {summary.is_low_stock && t(tStockList.form.lowStockAlert)}
            </Alert>
          )}

          <Select
            label={t(tStockList.form.typeLabel)}
            data={[
              { value: "IN", label: t(tStockList.form.typeIn) },
              { value: "OUT", label: t(tStockList.form.typeOut) },
              { value: "ADJUST", label: t(tStockList.form.typeAdjust) },
            ]}
            {...form.getInputProps("type")}
          />

          <NumberInput
            label={t(tStockList.form.quantityLabel)}
            placeholder={
              selectedType === "ADJUST"
                ? t(tStockList.form.quantityAdjustPlaceholder)
                : t(tStockList.form.quantityPlaceholder)
            }
            min={selectedType === "ADJUST" ? undefined : 1}
            allowNegative={selectedType === "ADJUST"}
            {...form.getInputProps("quantity")}
          />

          {selectedType === "ADJUST" && (
            <TextInput
              label={t(tStockList.form.reasonLabel)}
              placeholder={t(tStockList.form.reasonPlaceholder)}
              required
              {...form.getInputProps("reason")}
            />
          )}

          <TextInput
            label={t(tStockList.form.noteLabel)}
            placeholder={t(tStockList.form.notePlaceholder)}
            {...form.getInputProps("note")}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={onClose}>
              {t(tBasic.textCancel)}
            </Button>
            <Button type="submit" loading={isLoading}>
              {t(tStockList.form.submit)}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
