import { create } from 'zustand';

type AvatarState = {
    avatar: string;
    setAvatar: (newAvatar: string) => void;
}

const useAvatar = create<AvatarState>((set) => ({
    avatar: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1746998854~exp=1747002454~hmac=bff075006ec87a7387029eaa590f690c79816854fb86feb9eafe3c354b0480a1&w=740",
    setAvatar: (newAvatar) => set({ avatar: newAvatar }),
}));

export default useAvatar;