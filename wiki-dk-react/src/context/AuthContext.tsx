import { createContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL

type User = {
  id: number
  name: string
  email: string
  role: number
  userIcon: string
  ranks: number[]
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (minRole: number) => boolean;
  logout: () => void;
  login: (name : string, password: string) => Promise<boolean | undefined>;
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);
  const token = localStorage.getItem("token");

  function checkAuthentication() {
    
    if (!token) {
      setUser(null);
      return;
    }
    fetch(`${API_URL}/users/get/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.id) {
          setUser(data.user);
          
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    checkAuthentication();    
  }

  async function refreshUser(){
    var fetchUser =  await fetch(`${API_URL}/users/get/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    var data = await fetchUser.json()
    setUser(data.user);
  }

  async function login(name: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token', data.token);

        checkAuthentication();
        return true;
      }
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }

    function hasRole(minRole: number){
    return user ? user.role >= minRole : false;
  }

  useEffect(() => {
    setIsAuthenticated(user != null);
  }, [user])
  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, hasRole, logout, login, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
