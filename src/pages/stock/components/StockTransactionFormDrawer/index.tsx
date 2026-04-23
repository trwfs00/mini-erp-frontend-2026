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
import { useProductOptions } from "@/hooks/product/useProductOptions";
import { useStockSummary } from "@/hooks/stock/useStockSummary";
import { AlertCircle } from "lucide-react";

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
  const { options: productOptions, isLoading: isLoadingProducts } =
    useProductOptions();
  const { summary, fetchSummary } =
    useStockSummary();

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

  // Watch product_id to fetch current stock
  useEffect(() => {
    if (form.values.product_id) {
      fetchSummary(form.values.product_id);
    }
  }, [form.values.product_id, fetchSummary]);

  const handleSubmit = async (values: StockTransactionFormValues) => {
    // Advanced check: No negative stock on OUT
    if (values.type === "OUT" && summary) {
      if (values.quantity > summary.current_stock) {
        form.setFieldError(
          "quantity",
          `Insufficient stock. Current balance is ${summary.current_stock}`,
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
      title="Create Stock Transaction"
      position="right"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Product"
            placeholder="Select product"
            data={productOptions}
            searchable
            disabled={isLoadingProducts}
            {...form.getInputProps("product_id")}
          />

          {summary && (
            <Alert
              icon={<AlertCircle size={16} />}
              title="Inventory Status"
              color={summary.is_low_stock ? "orange" : "blue"}
              variant="light"
            >
              Current Stock: <strong>{summary.current_stock}</strong> 
              {summary.is_low_stock && " (Low Stock Alert!)"}
            </Alert>
          )}

          <Select
            label="Transaction Type"
            data={[
              { value: "IN", label: "Stock IN (Receive)" },
              { value: "OUT", label: "Stock OUT (Release)" },
              { value: "ADJUST", label: "Stock ADJUST (Correction)" },
            ]}
            {...form.getInputProps("type")}
          />

          <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            min={1}
            {...form.getInputProps("quantity")}
          />

          {selectedType === "ADJUST" && (
            <TextInput
              label="Reason for Adjustment"
              placeholder="e.g. Damaged goods, Stock count correction"
              required
              {...form.getInputProps("reason")}
            />
          )}

          <TextInput
            label="Note (Optional)"
            placeholder="Add extra details..."
            {...form.getInputProps("note")}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Submit Transaction
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
