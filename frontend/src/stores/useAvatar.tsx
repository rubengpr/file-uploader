import { create } from 'zustand';

type AvatarState = {
    avatar: string;
    setAvatar: (newAvatar: string) => void;
}

const useAvatar = create<AvatarState>((set) => ({
    avatar: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    setAvatar: (newAvatar) => set({ avatar: newAvatar }),
}));

export default useAvatar;