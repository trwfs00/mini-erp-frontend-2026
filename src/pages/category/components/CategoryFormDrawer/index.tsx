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
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";
import { tCategoryList } from "@/consts/translations/tCategoryList";

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
  const t = useTranslation();
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
  }, [opened, category]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        isEditing
          ? t(tCategoryList.form.editTitle)
          : t(tCategoryList.form.addTitle)
      }
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
            label={t(tCategoryList.form.nameLabel)}
            placeholder={t(tCategoryList.form.namePlaceholder)}
            withAsterisk
            {...form.getInputProps("name")}
          />

          <Textarea
            label={t(tCategoryList.form.descriptionLabel)}
            placeholder={t(tCategoryList.form.descriptionPlaceholder)}
            withAsterisk
            minRows={3}
            autosize
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              {t(tBasic.textCancel)}
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing
                ? t(tCategoryList.form.submitEdit)
                : t(tCategoryList.form.submitCreate)}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
