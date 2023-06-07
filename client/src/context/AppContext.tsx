import { createContext, useReducer, useContext } from "react";
import {  AppReducer,  initialState } from "../reducer/AppReducer";
import { AppContextType, AuthResponse } from "../models/types";
import { login as authServiceLogin } from "../services/authService";  


const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Dentro do AppContext
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response: AuthResponse = await authServiceLogin(email, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.token });  
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAIL", payload: (error as Error).message });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
