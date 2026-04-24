import { useEffect } from "react";
import {
  Drawer,
  Button,
  TextInput,
  Textarea,
  Stack,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import {
  supplierSchema,
  type SupplierFormValues,
} from "@/schemas/supplierSchema";
import type { SupplierList } from "@/types/supplier/SupplierList";

type Props = {
  opened: boolean;
  onClose: () => void;
  supplier?: SupplierList | null;
  onSave: (values: SupplierFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const SupplierFormDrawer = ({
  opened,
  onClose,
  supplier,
  onSave,
  isLoading = false,
}: Props) => {
  const isEditing = !!supplier;

  const form = useForm<SupplierFormValues>({
    validate: yupResolver(supplierSchema),
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (opened) {
      if (supplier) {
        form.setValues({
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
        });
      } else {
        form.reset();
      }
    }
  }, [opened, supplier]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={isEditing ? "Edit Supplier" : "Add New Supplier"}
      styles={{
        title: {
          fontWeight: 600,
          fontSize: 18,
        },
      }}
    >
      <form
        onSubmit={form.onSubmit(async (values: SupplierFormValues) => {
          await onSave(values);
          form.reset();
        })}
      >
        <Stack gap="md">
          <TextInput
            label="Supplier Name"
            placeholder="e.g. Global Foods Co., Ltd."
            withAsterisk
            {...form.getInputProps("name")}
          />

          <SimpleGrid cols={2}>
            <TextInput
              label="Phone Number"
              placeholder="e.g. 02-123-4567"
              withAsterisk
              {...form.getInputProps("phone")}
            />
            <TextInput
              label="Email Address"
              placeholder="e.g. contact@supplier.com"
              withAsterisk
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <Textarea
            label="Address"
            placeholder="Full business address"
            withAsterisk
            minRows={4}
            autosize
            {...form.getInputProps("address")}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing ? "Save Changes" : "Create Supplier"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
