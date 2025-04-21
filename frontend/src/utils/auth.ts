import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  export const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return exp < currentTime
  }
  
  export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // optional redirect
  };