export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  postalCode: string;
  country: string;
  active: boolean;
  role: 'user' | 'admin';
}

