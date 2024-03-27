import { User } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();

  const login = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(undefined);
  }, []);

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (userJSON != null) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userJSON);
        setUser(user);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    }
    return () => {
      logout();
    };
  }, [logout]);

  return { isLoggedIn, user, login, logout };
};
