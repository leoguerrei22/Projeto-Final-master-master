import React from 'react';

interface User {
  email: string;
  role: string;
  token: string;
}

interface UserContextData {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = React.createContext<UserContextData>({
  user: null,
  setUser: () => {},
});

export default UserContext;
