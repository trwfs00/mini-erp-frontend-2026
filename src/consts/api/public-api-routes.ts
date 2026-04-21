//calling these routes will not trigger the refresh token process
export const publicApiRoutes = [
  "/auth/login",
  "/auth/forgotPassword",
  "/auth/checkUpdatePasswordToken",
  "/auth/updatePassword",
  "/auth/verifyActivateToken",
  "/auth/activate",
  "/auth/token/refresh",
];
