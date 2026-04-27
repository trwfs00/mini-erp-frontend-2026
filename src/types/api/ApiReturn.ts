export type ApiReturn<T> = {
  ok: boolean;
  data?: T;
  code?: string;
  message?: string;
};
