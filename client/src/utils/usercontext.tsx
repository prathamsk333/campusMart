import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import getToken from './getToken';

const isTokenExpired = (token: string | undefined) => {
 
  try {
    if (!token) {return true}

    else{
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp?decodedToken.exp < currentTime:false;
      
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const UserContext = createContext(null);

export const UserProvider = ({ children }:any) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const token = getToken();
    const check = isTokenExpired(token);

    if (token && isTokenExpired(token)) {
      console.log('Token expired');
      Cookies.remove('jwt');
      localStorage.removeItem('user');
      window.location.reload();
        
      return null;
    }

    return storedUser ? JSON.parse(storedUser) : null;
  });
        
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    Cookies.remove('jwt');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};