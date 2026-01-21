export interface User {
  id?: number | string | null;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
}

export interface Token {
  [prop: string]: any;

  access_token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refresh_token?: string;
}
