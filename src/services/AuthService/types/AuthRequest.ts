export type LoginRequest = {
  username: string;
  password: string;
  remember_me?: boolean;
};

export type RefreshTokenRequest = {
  access_token: string;
  refresh_token: string;
};
