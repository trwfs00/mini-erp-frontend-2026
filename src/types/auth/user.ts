export type User = {
  user_id: number;
  name: string;
  username: string;
  role_id: number;
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  refresh_token_exp: number;
  remember_me: boolean;
};
