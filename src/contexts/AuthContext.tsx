// src\contexts\AuthContext.tsx

import { createContext, ReactNode, useEffect, useState } from "react";

import { parseCookies, destroyCookie, setCookie } from "nookies";
import { api } from "../utils/api";

export type UserDataDto = {
  uuid: string;
  email: string;
  type: string;
  userDetails: {
    uuid: string;
    name: string;
    profileImageUrl: string;
  };
};

export type AuthResponseDto = {
  accessToken: string;
  userData: UserDataDto;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextData = {
  signInByEmail: (
    email: string,
    password: string
  ) => Promise<UserDataDto | null>;
  signInByGoogle: (token: string) => Promise<UserDataDto | null>;
  signOut: () => void;
  user: UserDataDto | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

let authChannel: BroadcastChannel;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDataDto | null>(() => {
    const userLocalStorage = localStorage.getItem("user");
    return userLocalStorage ? JSON.parse(userLocalStorage) : null;
  });

  const verifyToken = async () => {
    try {
      const { data } = await api.get<UserDataDto>("/auth/verify-token", {
        headers: { Authorization: `Bearer ${parseCookies()["auth.token"]}` },
      });
      // console.log("verifyToken", data);
      setUser(data);
    } catch (error) {
      console.error("Token verification failed", error);
      signOut();
      return null;
    }
  };

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    getUserInfos();
  }, []);

  const signInByEmail = async (
    email: string,
    password: string
  ): Promise<UserDataDto | null> => {
    try {
      const { data } = await api.post<AuthResponseDto>("/auth/login", {
        email,
        password,
      });

      setCookie(null, "auth.token", data.accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      localStorage.setItem("user", JSON.stringify(data.userData));
      setUser(data.userData);
      return data.userData;
    } catch (error) {
      console.error("Login failed", error);
      return null;
    }
  };

  const signInByGoogle = async (token: string): Promise<UserDataDto | null> => {
    try {
      const { data } = await api.post<AuthResponseDto>("/auth/google", {
        token,
      });

      setCookie(null, "auth.token", data.accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      localStorage.setItem("user", JSON.stringify(data.userData));
      setUser(data.userData);
      return data.userData;
    } catch (error) {
      console.error("Google login failed", error);
      return null;
    }
  };

  const signOut = () => {
    destroyCookie(null, "auth.token", { path: "/" });
    localStorage.removeItem("user");
    setUser(null);
  };

  const getUserInfos = async () => {
    const { "auth.token": token } = parseCookies();
    const userDataString = localStorage.getItem("user");

    if (token && userDataString) {
      try {
        const response = await verifyToken();
        // console.log(response);
        if (response) {
          console.log(response);
          setUser(response);
        }
      } catch (error) {
        signOut();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signInByEmail,
        signInByGoogle,
        signOut,
        user,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
