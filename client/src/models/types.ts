// models/types.ts

import { AppAction, AppState } from "@/reducer/AppReducer";

export interface AuthResponse {
  token: {
    id: number;
    email?: string;
    role: number;
    token: string;
  };
}

export interface UserContextData {
  user: User | null;
  setUser: (user: User | null) => void;
}

export type AppContextType = {
  state: AppState;
  login: (email: string, password: string) => Promise<AuthResponse>; 
  logout: () => void;
  dispatch: React.Dispatch<AppAction>
};

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  orders?: Order[];
  reservations?: Reservation[];
  invoices?: Invoice[];
}

export interface Reservation {
  id: number;
  userId: number;
  date: string;
  quantity: number;
  hour: string;
  observations?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reservationTables?: ReservationTable[];
  orders?: Order[];
  user?: User;
  status: string;
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
  deleted?: boolean;
  orders?: Order[];
  reservationTables?: ReservationTable[];
}

export interface ReservationTable {
  id: number;
  reservationId: number;
  tableId: number;
  reservation?: Reservation;
  table?: Table;
}

export interface Order {
  id: number;
  tableId: number;
  userId: number;
  reservationId?: number;
  invoiceID?: number;
  totalPrice: number;
  status: string;
  observations?: string;
  deleted?: boolean;
  createdAt?: string;
  tableNumber?: number;
  updatedAt?: string;
  table?: Table;
  user?: User;
  reservation?: Reservation;
  products?: Product[];
  invoice?: Invoice;
  orders?: any;
  innerOrder?: any
  orderProducts: OrderProduct[];
  ReservationTable: ReservationTable[];

}

export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  observations?: string;
  status: string;
  price: number;
  deleted?: boolean;
  orders?: Order[];
}

export interface Invoice {
  id: number;
  userId: number;
  billingDetails?: string;
  paymentMethod: string;
  observations?: string;
  paymentStatus: string;
  deleted?: boolean;
  user?: User;
  orders?: Order[];
  reservation?: Reservation
}

export interface OrderProduct {
  orderId: number;
  productId: number;
  quantity: number;
  product: Product;
}
