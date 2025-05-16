import { create } from "zustand";

type UserState = {
    fullname: string,
    email: string,
    country: string,
    role: string,
    language: string,
    timezone: string,
    setFullname: (newFullname) => void,
    setEmail: (newEmail) => void,
    setCountry: (newCountry) => void,
    setRole: (newRole) => void,
    setLanguage: (newLanguage) => void,
    setTimezone: (newTimezone) => void,
    setUser: (user: {
        fullname: string;
        email: string;
        country: string;
        role: string;
        language: string;
        timezone: string;
      }) => void;
      
}

const useUser = create<UserState>((set) => ({
    fullname: "",
    email: "",
    country: "",
    role: "",
    language: "",
    timezone: "",
  
    setFullname: (newFullname) => set({ fullname: newFullname }),
    setEmail: (newEmail) => set({ email: newEmail }),
    setCountry: (newCountry) => set({ country: newCountry }),
    setRole: (newRole) => set({ role: newRole }),
    setLanguage: (newLanguage) => set({ language: newLanguage }),
    setTimezone: (newTimezone) => set({ timezone: newTimezone }),
  
    setUser: (user) =>
      set({
        fullname: user.fullname,
        email: user.email,
        country: user.country,
        role: user.role,
        language: user.language,
        timezone: user.timezone,
      }),
  }));
  
export default useUser;