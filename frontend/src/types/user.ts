export type User = {

  id: number;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
    
  access_token: string;
  token_type: string;
  user: User;
};