import { loginSchema, type LoginFormData } from "@/schemas/loginSchema";
import { useEffect, type FC } from "react";
import { useStore } from "@nanostores/react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "mantine-form-yup-resolver";
// TODO: เปลี่ยนกลับเป็น AuthService + LoginRequest เมื่อ integrate API จริง
// import { AuthService } from "@/services/AuthService";
// import type { LoginRequest } from "@/services/AuthService/types/AuthRequest";
import { useMockAuthUser } from "@/pages/hooks/useMockAuthUser";
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
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tLogin } from "@/consts/translations/tLogin";

export const LoginPage: FC = () => {
  const t = useTranslation();
  const authUser = useStore($authUser);
  const navigate = useNavigate();
  const { getMockAuthUser } = useMockAuthUser();
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

    const mockUser = await getMockAuthUser(values.username, values.remember_me);
    if (!mockUser) {
      form.setErrors({
        password: t(tLogin.invalidCredentials),
      });
      return;
    }
    LocalStorageUtil.saveAuthUser(mockUser);
    $authUser.set(mockUser);
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <Box w={420} px="xs">
      <title>{t(tLogin.pageTitle)}</title>

      <Stack gap={4} mb="xl" align="center">
        <LockIcon size={26} color="black" strokeWidth={2.25} />

        <Title order={1} fz={26} fw={700} lh={1.2} c="gray.9">
          {t(tLogin.welcome)}
        </Title>
        <Text c="gray.6" fz="sm">
          {t(tLogin.subtitle)}
        </Text>
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
              <Text fz="xs" c="gray.5">
                {t(tLogin.divider)}
              </Text>
            }
            labelPosition="center"
            my="xs"
          />

          {/* TODO: ลบบล็อกนี้เมื่อ integrate API จริง */}
          <Text fz="xs" c="dimmed" ta="center" mt={-8}>
            {t(tLogin.mockHint)}{" "}
            <Text component="span" fw={600} c="gray.7">
              admin
            </Text>{" "}
            /{" "}
            <Text component="span" fw={600} c="gray.7">
              staff
            </Text>{" "}
            /{" "}
            <Text component="span" fw={600} c="gray.7">
              viewer
            </Text>
            {t(tLogin.mockSuffix)}
          </Text>
        </Stack>
      </form>
    </Box>
  );
};
