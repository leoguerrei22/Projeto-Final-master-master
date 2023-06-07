import { AuthResponse, User } from "../models/types";

export type AppState = {
  user: User | null;
  error: string | null;
  isLoggedIn: boolean;
};

export const initialState: AppState = {
  user: null,
  error: null,
  isLoggedIn: false,
};

export type AppAction = {
  type: string;
  payload?: AuthResponse | any ;
};

export function AppReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      if (typeof action.payload !== 'string') {
        localStorage.setItem("token", action.payload.token);
        return { ...state, user: action.payload, error: null, isLoggedIn: true };    
      } else {
        return state;
      }
    case "LOGIN_FAIL":
      return { ...state, user: null, error: action.payload };
    case "LOGOUT":
      localStorage.removeItem("token")
      localStorage.removeItem("authRole")
      localStorage.removeItem("authId");
      return { ...state, user: null, error: null, isLoggedIn: false };
    default:
      return state;
  }
}

