import { PageLayout } from "@/components/Layouts/Page";
import {
  Stack,
  Text,
  Title,
  Group,
  Button,
  Paper,
  Select,
  TextInput,
  NumberInput,
  ActionIcon,
  Table,
  Divider,
} from "@mantine/core";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/router/routePaths";
import { SupplierService } from "@/services/SupplierService";
import { ProductService } from "@/services/ProductService";
import { PurchaseOrderService } from "@/services/PurchaseOrderService";
import type { SupplierList } from "@/types/supplier/SupplierList";
import type { ProductList } from "@/types/product/ProductList";
import { useForm } from "@mantine/form";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { modals } from "@mantine/modals";
import { $authUser } from "@/stores/authUserStore";
import { useStore } from "@nanostores/react";

type POItemFormValue = {
  product_id: string;
  quantity: number;
  unit_price: number;
};

type POFormValues = {
  order_number: string;
  supplier_id: string;
  items: POItemFormValue[];
};

const PurchaseOrderCreatePage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierList[]>([]);
  const [products, setProducts] = useState<ProductList[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authUser = useStore($authUser);

  const form = useForm<POFormValues>({
    initialValues: {
      order_number: "",
      supplier_id: "",
      items: [{ product_id: "", quantity: 1, unit_price: 0 }],
    },
    validate: {
      order_number: (value) =>
        !value.trim() ? "Please enter order number" : null,
      supplier_id: (value) => (!value ? "Please select a supplier" : null),
      items: {
        product_id: (value) => (!value ? "Select product" : null),
        quantity: (value) => (value <= 0 ? "Qty > 0" : null),
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [supRes, prodRes] = await Promise.all([
        SupplierService.getSupplierList({
          page: 1,
          limit: 100,
          criteria: {},
          sort_bys: [],
        }),
        ProductService.getProductList({
          page: 1,
          limit: 100,
          criteria: {},
          sort_bys: [],
        }),
      ]);
      if (supRes.ok) setSuppliers(supRes.data?.data || []);
      if (prodRes.ok) setProducts(prodRes.data?.data || []);
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    form.insertListItem("items", {
      product_id: "",
      quantity: 1,
      unit_price: 0,
    });
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.product_id === productId);
    if (product) {
      form.setFieldValue(`items.${index}.unit_price`, product.cost_price);
    }
  };

  const calculateTotal = () => {
    return form.values.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
  };

  const handleSubmit = async (values: POFormValues) => {
    setIsSubmitting(true);
    const response = await PurchaseOrderService.createPurchaseOrder({
      order_number: values.order_number.trim(),
      supplier_id: values.supplier_id,
      created_by: authUser?.user_id || "",
      total_amount: calculateTotal(),
      items: values.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    });

    if (response.ok) {
      modals.openContextModal({
        modal: "success",
        innerProps: { message: "Purchase Order created successfully" },
      } as any);
      navigate(ROUTE_PATHS.PURCHASE_ORDERS);
    } else {
      console.error(response.message || "Failed to create PO");
    }
    setIsSubmitting(false);
  };

  const itemRows = form.values.items.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Select
          placeholder="Select Product"
          data={products.map((p) => ({
            value: p.product_id,
            label: `${p.sku} - ${p.name}`,
          }))}
          {...form.getInputProps(`items.${index}.product_id`)}
          onChange={(val) => {
            form.setFieldValue(`items.${index}.product_id`, val || "");
            handleProductChange(index, val || "");
          }}
          searchable
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          min={1}
          {...form.getInputProps(`items.${index}.quantity`)}
          w={100}
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          min={0}
          decimalScale={2}
          {...form.getInputProps(`items.${index}.unit_price`)}
          w={150}
        />
      </Table.Td>
      <Table.Td align="right">
        <Text fw={500}>{formatCurrency(item.quantity * item.unit_price)}</Text>
      </Table.Td>
      <Table.Td align="center">
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() => form.removeListItem("items", index)}
          disabled={form.values.items.length === 1}
        >
          <Trash2 size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <PageLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </ActionIcon>
            <Stack gap={0}>
              <Title order={2} fw={700}>
                Create Purchase Order
              </Title>
              <Text c="gray.6" fz="sm">
                Fill in the details to create a new purchase order.
              </Text>
            </Stack>
          </Group>
          <Button
            leftSection={<Save size={18} />}
            onClick={() => form.onSubmit(handleSubmit)()}
            loading={isSubmitting}
          >
            Save Purchase Order
          </Button>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Paper withBorder p="md" radius="md">
              <Group grow align="flex-start">
                <TextInput
                  label="Order Number"
                  placeholder="e.g. PO-2026-001"
                  {...form.getInputProps("order_number")}
                  required
                />
                <Select
                  label="Supplier"
                  placeholder="Choose supplier"
                  data={suppliers.map((s) => ({
                    value: s.supplier_id,
                    label: s.name,
                  }))}
                  {...form.getInputProps("supplier_id")}
                  searchable
                  required
                />
              </Group>
            </Paper>

            <Paper withBorder radius="md">
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th w={120}>Quantity</Table.Th>
                    <Table.Th w={170}>Unit Price</Table.Th>
                    <Table.Th w={150} ta="right">
                      Subtotal
                    </Table.Th>
                    <Table.Th w={80} ta="center"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{itemRows}</Table.Tbody>
              </Table>

              <Divider />

              <Group justify="space-between" p="md">
                <Button
                  variant="light"
                  leftSection={<Plus size={16} />}
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>

                <Stack gap={4} align="flex-end">
                  <Group gap="xl">
                    <Text fw={600} size="lg">
                      Total Amount:
                    </Text>
                    <Text fw={700} size="xl" c="blue.7">
                      {formatCurrency(calculateTotal())}
                    </Text>
                  </Group>
                </Stack>
              </Group>
            </Paper>
          </Stack>
        </form>
      </Stack>
    </PageLayout>
  );
};

export default PurchaseOrderCreatePage;
