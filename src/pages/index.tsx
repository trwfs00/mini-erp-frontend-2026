import { loginSchema, type LoginFormData } from "@/schemas/loginSchema";
import { useEffect, type FC } from "react";
import { useStore } from "@nanostores/react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "mantine-form-yup-resolver";
import { AuthService } from "@/services/AuthService";
import type { LoginRequest } from "@/services/AuthService/types/AuthRequest";
import { LocalStorageUtil } from "@/utils/LocalStorageUtil";
import { $authUser } from "@/stores/authUserStore";
import { ROUTE_PATHS } from "@/router/routePaths";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  EyeIcon,
  EyeOffIcon,
  LayoutGrid,
  LockIcon,
  UserIcon,
} from "lucide-react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tLogin } from "@/consts/translations/tLogin";

export const LoginPage: FC = () => {
  const t = useTranslation();
  const authUser = useStore($authUser);
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    validate: yupResolver(loginSchema),
    initialValues: {
      username: "",
      password: "",
      remember_me: false,
    },
  });

  useEffect(() => {
    if (authUser && authUser.refresh_token_exp > Date.now() / 1000) {
      navigate(ROUTE_PATHS.DASHBOARD);
    }
  }, [authUser, navigate]);

  const handleLogin = async (values: LoginFormData): Promise<void> => {
    const validateError = form.validate();
    if (validateError.hasErrors) return;

    const res = await AuthService.login(values as LoginRequest);
    if (!res.ok) {
      form.setErrors({
        password: res.message || t(tLogin.invalidCredentials),
      });
      return;
    }
    LocalStorageUtil.saveAuthUser(res.data);
    $authUser.set(res.data);
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <Box w={420} px="xs">
      <title>{t(tLogin.pageTitle)}</title>

      <Stack gap={10} mb="xl" align="center">
        <Box
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "var(--mantine-primary-color-filled)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 8px 24px color-mix(in srgb, var(--mantine-primary-color-filled) 30%, transparent)",
          }}
        >
          <LayoutGrid
            size={28}
            strokeWidth={2.25}
            color="var(--mantine-primary-color-contrast)"
          />
        </Box>

        <Stack gap={2} align="center">
          <Title order={1} fz={28} fw={700} lh={1.1}>
            {t(tLogin.welcome)}
          </Title>
          <Text c="dimmed" fz="sm">
            {t(tLogin.subtitle)}
          </Text>
        </Stack>
      </Stack>

      <form onSubmit={form.onSubmit(handleLogin)}>
        <Stack gap="md">
          <TextInput
            label={t(tLogin.usernameLabel)}
            placeholder={t(tLogin.usernamePlaceholder)}
            size="md"
            radius="md"
            leftSection={<UserIcon size={18} />}
            {...form.getInputProps("username")}
          />

          <PasswordInput
            label={t(tLogin.passwordLabel)}
            placeholder={t(tLogin.passwordPlaceholder)}
            size="md"
            radius="md"
            leftSection={<LockIcon size={18} />}
            visibilityToggleIcon={({ reveal }) =>
              reveal ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />
            }
            {...form.getInputProps("password")}
          />

          <Group justify="space-between" mt={-4}>
            <Checkbox
              label={t(tLogin.rememberMe)}
              size="sm"
              {...form.getInputProps("remember_me", { type: "checkbox" })}
            />
          </Group>

          <Button type="submit" size="md" radius="md" fullWidth mt="xs">
            {t(tLogin.signIn)}
          </Button>

          <Divider
            label={
              <Text fz="xs" c="dimmed">
                {t(tLogin.divider)}
              </Text>
            }
            labelPosition="center"
            my="xs"
          />
        </Stack>
      </form>
    </Box>
  );
};
