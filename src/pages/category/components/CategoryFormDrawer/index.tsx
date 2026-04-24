import { useEffect } from "react";
import {
  Drawer,
  Button,
  TextInput,
  Textarea,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/schemas/categorySchema";
import type { CategoryList } from "@/types/category/CategoryList";

type Props = {
  opened: boolean;
  onClose: () => void;
  category?: CategoryList | null;
  onSave: (values: CategoryFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const CategoryFormDrawer = ({
  opened,
  onClose,
  category,
  onSave,
  isLoading = false,
}: Props) => {
  const isEditing = !!category;

  const form = useForm<CategoryFormValues>({
    validate: yupResolver(categorySchema),
    initialValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (opened) {
      if (category) {
        form.setValues({
          name: category.name,
          description: category.description,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, category]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={isEditing ? "Edit Category" : "Add New Category"}
      styles={{
        title: {
          fontWeight: 600,
          fontSize: 18,
        },
      }}
    >
      <form
        onSubmit={form.onSubmit(async (values: CategoryFormValues) => {
          await onSave(values);
          form.reset();
        })}
      >
        <Stack gap="md">
          <TextInput
            label="Category Name"
            placeholder="e.g. Beverages, Snacks"
            withAsterisk
            {...form.getInputProps("name")}
          />

          <Textarea
            label="Description"
            placeholder="Describe what products belong to this category"
            withAsterisk
            minRows={3}
            autosize
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
