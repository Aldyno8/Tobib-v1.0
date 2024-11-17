import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;

interface UserProfile {
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
}

// Fetch user profile
export const getUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/auth/users/me/`, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, profileData: FormData): Promise<UserProfile> => {
  try {
    const response = await axios.patch<UserProfile>(`${API_URL}/auth/users/profile/edit/`, profileData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server response:', error.response.data); // Log server response
    }
    console.error('Error updating user profile:', error);
    throw error;
  }
};






export const getAllUsers = async (token: string): Promise<UserProfile[]> => {
  try {
    const response = await axios.get<UserProfile[]>(`${API_URL}/auth/users/all/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });


    return response.data;
  } catch (error: any) {

    if (axios.isAxiosError(error)) {
      console.error('Erreur lors de la récupération de tous les utilisateurs:', error.response?.data || error.message);
      throw new Error(`Erreur de récupération des utilisateurs: ${error.response?.data?.detail || error.message}`);
    } else {

      console.error('Erreur inattendue:', error);
      throw new Error('Une erreur inattendue est survenue');
    }
  }
};


export const getSpecificUSer = async (token: string, userId: number): Promise<UserProfile> => {
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/auth/users/${userId}/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching specific user profile:', error);
    throw error;
  }
};