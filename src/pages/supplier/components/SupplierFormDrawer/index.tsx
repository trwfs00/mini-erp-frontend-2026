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
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";
import { tSupplierList } from "@/consts/translations/tSupplierList";

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
  const t = useTranslation();
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
      title={
        isEditing
          ? t(tSupplierList.form.editTitle)
          : t(tSupplierList.form.addTitle)
      }
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
            label={t(tSupplierList.form.nameLabel)}
            placeholder={t(tSupplierList.form.namePlaceholder)}
            withAsterisk
            {...form.getInputProps("name")}
          />

          <SimpleGrid cols={2}>
            <TextInput
              label={t(tSupplierList.form.phoneLabel)}
              placeholder={t(tSupplierList.form.phonePlaceholder)}
              withAsterisk
              {...form.getInputProps("phone")}
            />
            <TextInput
              label={t(tSupplierList.form.emailLabel)}
              placeholder={t(tSupplierList.form.emailPlaceholder)}
              withAsterisk
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <Textarea
            label={t(tSupplierList.form.addressLabel)}
            placeholder={t(tSupplierList.form.addressPlaceholder)}
            withAsterisk
            minRows={4}
            autosize
            {...form.getInputProps("address")}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              {t(tBasic.textCancel)}
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing
                ? t(tSupplierList.form.submitEdit)
                : t(tSupplierList.form.submitCreate)}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
