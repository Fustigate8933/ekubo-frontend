export type LoginResponse = {
  token: string;
};

export type LoginFormData = {
  username: string;
  email?: string;
  password: string;
}
