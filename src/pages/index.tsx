import { loginSchema, type LoginFormData } from "@/schemas/loginSchema";
import { useEffect, type FC } from "react";
import { useStore } from "@nanostores/react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "mantine-form-yup-resolver";
import { AuthService } from "@/services/AuthService";
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
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import type { User } from "@/types/auth/User";
import type { LoginRequest } from "@/services/AuthService/types/AuthRequest";

export const LoginPage: FC = () => {
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
      form.setErrors({ password: res.message || "Login failed" });
      return;
    }

    LocalStorageUtil.saveAuthUser(res.data as User);
    $authUser.set(res.data as User);
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <Box w={420} px="xs">
      <title>Login | Welcome Back</title>

      <Stack gap={4} mb="xl" align="center">
        <LockIcon size={26} color="black" strokeWidth={2.25} />

        <Title order={1} fz={26} fw={700} lh={1.2} c="gray.9">
          Welcome Back
        </Title>
        <Text c="gray.6" fz="sm">
          Sign in to continue to Mini ERP
        </Text>
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
            {/* <Anchor
              fz="sm"
              fw={500}
              c="indigo.6"
              onClick={() => navigate("/auth/forget-password")}
            >
              Forgot password?
            </Anchor> */}
          </Group>

          <Button
            type="submit"
            size="md"
            radius="md"
            fullWidth
            mt="xs"
            styles={{
              root: {
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                border: "none",
                transition: "transform 150ms ease, box-shadow 150ms ease",
              },
            }}
          >
            Sign in
          </Button>

          <Divider
            label={
              <Text fz="xs" c="gray.5">
                Mini ERP · Secure access
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
