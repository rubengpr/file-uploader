import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false

    const { exp } = jwtDecode<{ exp: number }>(token)
    const currentTime = Date.now() / 1000
    if (exp < currentTime) {
      return false
    }
    return true
  } catch {
    return false
  }
}

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