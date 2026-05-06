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
  // Anchor,
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

export const LoginPage: FC = () => {
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

    // TODO: เปลี่ยนกลับเป็น AuthService.login เมื่อ integrate API จริง
    // --- Real API (uncomment when backend is ready) ---
    // const res = await AuthService.login(values as LoginRequest);
    // if (!res.ok || !res.data) {
    //   form.setErrors({ password: res.message || "Login failed" });
    //   return;
    // }
    // LocalStorageUtil.saveAuthUser(res.data);
    // $authUser.set(res.data);
    // navigate(ROUTE_PATHS.DASHBOARD);

    // --- Mock (remove when backend is ready) ---
    const mockUser = await getMockAuthUser(
      values.username.trim(),
      values.remember_me,
    );
    if (!mockUser) {
      form.setErrors({
        password: "Invalid credentials (try: admin / staff / viewer)",
      });
      return;
    }
    LocalStorageUtil.saveAuthUser(mockUser);
    $authUser.set(mockUser);
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <Box w={420} px="xs">
      <title>Login | Welcome Back</title>

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
            Welcome back
          </Title>
          <Text c="dimmed" fz="sm">
            Sign in to continue to Mini ERP
          </Text>
        </Stack>
      </Stack>

      <form onSubmit={form.onSubmit(handleLogin)}>
        <Stack gap="md">
          <TextInput
            label="Username"
            placeholder="Enter your username"
            size="md"
            radius="md"
            leftSection={<UserIcon size={18} />}
            {...form.getInputProps("username")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
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
              label="Remember me"
              size="sm"
              {...form.getInputProps("remember_me", { type: "checkbox" })}
            />
          </Group>

          <Button type="submit" size="md" radius="md" fullWidth mt="xs">
            Sign in
          </Button>

          <Divider
            label={
              <Text fz="xs" c="dimmed">
                Mini ERP · Secure access
              </Text>
            }
            labelPosition="center"
            my="xs"
          />

          {/* TODO: ลบบล็อกนี้เมื่อ integrate API จริง */}
          <Text fz="xs" c="dimmed" ta="center" mt={-8}>
            Mock mode — try{" "}
            <Text component="span" fw={600} c="bright">
              admin
            </Text>{" "}
            /{" "}
            <Text component="span" fw={600} c="bright">
              staff
            </Text>{" "}
            /{" "}
            <Text component="span" fw={600} c="bright">
              viewer
            </Text>{" "}
            (any password)
          </Text>
        </Stack>
      </form>
    </Box>
  );
};
