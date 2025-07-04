import { create } from "zustand";

type UserState = {
    userId: string,
    fullname: string,
    email: string,
    country: string,
    role: string,
    language: string,
    timezone: string,
    setUserId: (newId: string) => void,
    setFullname: (newFullname: string) => void,
    setEmail: (newEmail: string) => void,
    setCountry: (newCountry: string) => void,
    setRole: (newRole: string) => void,
    setLanguage: (newLanguage: string) => void,
    setTimezone: (newTimezone: string) => void,
    setUser: (user: {
        id: string;
        fullname: string;
        email: string;
        country: string;
        role: string;
        language: string;
        timezone: string;
    }) => void;     
}

const useUser = create<UserState>((set) => ({
    userId: "",
    fullname: "",
    email: "",
    country: "",
    role: "",
    language: "",
    timezone: "",
  
    setUserId: (newId) => set({ userId: newId }),
    setFullname: (newFullname) => set({ fullname: newFullname }),
    setEmail: (newEmail) => set({ email: newEmail }),
    setCountry: (newCountry) => set({ country: newCountry }),
    setRole: (newRole) => set({ role: newRole }),
    setLanguage: (newLanguage) => set({ language: newLanguage }),
    setTimezone: (newTimezone) => set({ timezone: newTimezone }),
  
    setUser: (user) =>
      set({
        userId: user.id,
        fullname: user.fullname,
        email: user.email,
        country: user.country,
        role: user.role,
        language: user.language,
        timezone: user.timezone,
      }),
  }));
  
export default useUser;