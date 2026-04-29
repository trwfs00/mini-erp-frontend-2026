export type UserRole = {
  role_id: string;
  name: string;
};

export type User = {
  user_id: string;
  username: string;
  role: UserRole;
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  refresh_token_exp: number;
  remember_me: boolean;
};
