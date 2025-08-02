import { create } from 'zustand';
import { User } from "firebase/auth";
import { Ministry, Room } from './types';

interface AuthStore {
    isAdmin: boolean;
    user: User | null;
    ministry: string | null; 
    setIsAdmin: (isAdmin: boolean) => void;
    setUser: (user: User | null) => void;
    setMinistry: (ministry: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    user: null,
    ministry: null,
    setIsAdmin: (role) => set({isAdmin: role}),
    setUser: (user) => set({user}),
    setMinistry: (ministry) => set({ministry}),
}));

interface GeneralStore {
    rooms: Room[];
    ministries: Ministry[];
    setRooms: (rooms: Room[]) => void;
    setMinistries: (ministries: Ministry[]) => void;
}

export const useGeneralStore = create<GeneralStore>((set) => ({
    rooms: [],
    ministries: [],
    setRooms: (rooms) => set({rooms}),
    setMinistries: (ministries) => set({ministries}),
}));

