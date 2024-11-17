import { create } from 'zustand';
import {
  getUserProfile,
  updateUserProfile as updateUserProfileAPI,
  getAllUsers,
  getSpecificUSer
} from '@/services/user-api.tsx';

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  bio: string;
  website: string;
  role: string;
  profile_picture?: string;
  date_of_birth?: string;
  alternate_email?: string;
  linkedin?: string;
  is_active?: boolean;
}

interface UserState {
  user: UserProfile | null;
  users: UserProfile[]; // Ajout de la liste des utilisateurs
  specificUser: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: FormData) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  fetchSpecificUser: (userId: number) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  users: [],
  specificUser: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  fetchUserProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const userProfile = await getUserProfile(token);
      set({ user: userProfile, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  },

  updateUserProfile: async (profileData: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token available to update profile.');
      return;
    }

    try {
      const updatedProfile = await updateUserProfileAPI(token, profileData);
      set({ user: updatedProfile });
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  },

  fetchAllUsers: async () => { // Correction du nom de la méthode
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const users = await getAllUsers(token);

      set({ users : users, isAuthenticated: true });


    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  fetchSpecificUser: async (userId: number) => { // Implémentation de la méthode
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const specificUser = await getSpecificUSer(token, userId);
      set({ specificUser });
    } catch (error) {
      console.error('Failed to fetch specific user profile:', error);
    }
  },

}));

export default useUserStore;
